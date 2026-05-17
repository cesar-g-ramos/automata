"""
Módulo Compilador de Código Intermedio para el Intérprete de Pila.

El StackCompiler recibe el código fuente como cadena de texto, invoca
al Lexer para obtener la secuencia de Tokens y luego aplica un parser
de descenso recursivo para generar la lista de Instrucciones de código
intermedio (OpCode). Soporta asignaciones, expresiones aritméticas,
bloques IF/ELSE y ciclos WHILE.

Gramática soportada (BNF simplificado):
    program    → statement*
    statement  → assign | if_stmt | while_stmt
    assign     → IDENTIFIER '=' expr
    if_stmt    → 'if' '(' condition ')' '{' program '}' ('else' '{' program '}')?
    while_stmt → 'while' '(' condition ')' '{' program '}'
    condition  → expr comparator expr
    comparator → '==' | '!=' | '<' | '>' | '<=' | '>='
    expr       → term (('+' | '-') term)*
    term       → factor (('*' | '/') factor)*
    factor     → NUMBER | IDENTIFIER | '(' expr ')'
"""

from models.stack_token import Token, TokenType
from models.stack_lexer import Lexer, LexerError
from models.stack_instruction import Instruction, OpCode

class CompilerError(Exception):
    """Excepción lanzada ante errores sintácticos durante la compilación."""
    pass

class StackCompiler:
    """Compilador de código fuente a instrucciones de pila.

    Attributes:
        _lexer  (Lexer):       Analizador léxico.
        _tokens (list[Token]): Secuencia de tokens producida por el Lexer.
        _pos    (int):         Cursor sobre _tokens.
        _label  (int):         Contador de etiquetas únicas para saltos.
    """

    def __init__(self):
        """Inicializa el compilador; los datos se cargan en compile()."""
        self._lexer:  Lexer        = None
        self._tokens: list[Token]  = []
        self._pos:    int          = 0
        self._label:  int          = 0

    # ------------------------------------------------------------------ #
    # Interfaz pública                                                     #
    # ------------------------------------------------------------------ #

    def compile(self, source: str) -> list[Instruction]:
        """Compila el código fuente y retorna la lista de instrucciones.

        Args:
            source (str): Código fuente del lenguaje simple.

        Returns:
            list[Instruction]: Programa en código intermedio de pila.

        Raises:
            LexerError:    Carácter no reconocido.
            CompilerError: Error sintáctico.
        """
        self._lexer  = Lexer(source)
        self._tokens = self._lexer.tokenize()
        self._pos    = 0
        self._label  = 0
        return self._parse_program()

    # ------------------------------------------------------------------ #
    # Utilidades de navegación sobre tokens                                #
    # ------------------------------------------------------------------ #

    def _current(self) -> Token:
        """Token en la posición actual."""
        if self._pos < len(self._tokens):
            return self._tokens[self._pos]
        return self._tokens[-1]   # EOF

    def _advance(self) -> Token:
        """Consume y retorna el token actual."""
        tok = self._current()
        self._pos += 1
        return tok

    def _expect(self, token_type: TokenType) -> Token:
        """Consume el token actual si su tipo coincide; lanza error si no.

        Args:
            token_type: Tipo esperado.

        Returns:
            Token: El token consumido.

        Raises:
            CompilerError: Si el tipo no coincide.
        """
        tok = self._current()
        if tok.type != token_type:
            raise CompilerError(
                f"Se esperaba '{token_type.name}' "
                f"pero se encontró '{tok.type.name}' ('{tok.value}') "
                f"en línea {tok.line}."
            )
        return self._advance()

    def _match(self, *types: TokenType) -> bool:
        """Retorna True si el token actual es de alguno de los tipos dados."""
        return self._current().type in types

    def _new_label(self, prefix: str = "L") -> str:
        """Genera una etiqueta única para saltos."""
        self._label += 1
        return f"{prefix}{self._label}"

    # ------------------------------------------------------------------ #
    # Parser de descenso recursivo                                         #
    # ------------------------------------------------------------------ #

    def _parse_program(self) -> list[Instruction]:
        """Parsea una secuencia de sentencias hasta EOF o '}'."""
        instructions: list[Instruction] = []
        while not self._match(TokenType.EOF):
            # RBRACE marca fin de bloque IF/ELSE/WHILE — lo maneja el padre
            if self._match(TokenType.RBRACE):
                break
            instructions.extend(self._parse_statement())
        return instructions

    def _parse_statement(self) -> list[Instruction]:
        """Despacha al parser de sentencia correspondiente."""
        tok = self._current()

        if tok.type == TokenType.IF:
            return self._parse_if()

        if tok.type == TokenType.WHILE:
            return self._parse_while()

        if tok.type == TokenType.IDENTIFIER:
            # Puede ser asignación: IDENTIFIER '=' expr
            return self._parse_assign()

        raise CompilerError(
            f"Sentencia inesperada '{tok.value}' en línea {tok.line}. "
            "Se esperaba una asignación, 'if' o 'while'."
        )

    def _parse_assign(self) -> list[Instruction]:
        """Parsea: IDENTIFIER '=' expr  →  [código de expr] + STORE <var>."""
        name = self._expect(TokenType.IDENTIFIER).value
        self._expect(TokenType.ASSIGN)
        instructions = self._parse_expr()
        instructions.append(Instruction(OpCode.STORE, name))
        return instructions

    def _parse_if(self) -> list[Instruction]:
        """Parsea: if ( condition ) { program } [ else { program } ]."""
        self._expect(TokenType.IF)
        self._expect(TokenType.LPAREN)
        instructions = self._parse_condition()
        self._expect(TokenType.RPAREN)

        label_else = self._new_label("ELSE")
        label_end  = self._new_label("END_IF")

        instructions.append(Instruction(OpCode.JUMP_IF_FALSE, label_else))

        # Bloque then
        self._expect_brace("{")
        instructions.extend(self._parse_program())
        self._expect_brace("}")

        instructions.append(Instruction(OpCode.JUMP, label_end))
        instructions.append(Instruction(OpCode.LABEL, label_else))

        # Bloque else (opcional)
        if self._match(TokenType.ELSE):
            self._advance()
            self._expect_brace("{")
            instructions.extend(self._parse_program())
            self._expect_brace("}")

        instructions.append(Instruction(OpCode.LABEL, label_end))
        return instructions

    def _parse_while(self) -> list[Instruction]:
        """Parsea: while ( condition ) { program }."""
        self._expect(TokenType.WHILE)
        self._expect(TokenType.LPAREN)

        label_start = self._new_label("WHILE_START")
        label_end   = self._new_label("WHILE_END")

        instructions: list[Instruction] = []
        instructions.append(Instruction(OpCode.LABEL, label_start))

        instructions.extend(self._parse_condition())
        self._expect(TokenType.RPAREN)

        instructions.append(Instruction(OpCode.JUMP_IF_FALSE, label_end))

        self._expect_brace("{")
        instructions.extend(self._parse_program())
        self._expect_brace("}")

        instructions.append(Instruction(OpCode.JUMP, label_start))
        instructions.append(Instruction(OpCode.LABEL, label_end))
        return instructions

    def _parse_condition(self) -> list[Instruction]:
        """Parsea: expr comparator expr → apila 1 (verdadero) o 0 (falso)."""
        instructions = self._parse_expr()

        # Mapa de TokenType comparador → OpCode CMP
        cmp_map = {
            TokenType.EQ:  OpCode.CMP_EQ,
            TokenType.NEQ: OpCode.CMP_NEQ,
            TokenType.LT:  OpCode.CMP_LT,
            TokenType.GT:  OpCode.CMP_GT,
            TokenType.LTE: OpCode.CMP_LTE,
            TokenType.GTE: OpCode.CMP_GTE,
        }

        if self._current().type not in cmp_map:
            raise CompilerError(
                f"Se esperaba un comparador (==, !=, <, >, <=, >=) "
                f"pero se encontró '{self._current().value}' "
                f"en línea {self._current().line}."
            )

        op = cmp_map[self._advance().type]
        instructions.extend(self._parse_expr())
        instructions.append(Instruction(op))
        return instructions

    # ── Expresiones aritméticas (precedencia estándar) ──────────────── #

    def _parse_expr(self) -> list[Instruction]:
        """expr → term (('+' | '-') term)*"""
        instructions = self._parse_term()
        while self._match(TokenType.PLUS, TokenType.MINUS):
            op_tok = self._advance()
            instructions.extend(self._parse_term())
            if op_tok.type == TokenType.PLUS:
                instructions.append(Instruction(OpCode.ADD))
            else:
                instructions.append(Instruction(OpCode.SUB))
        return instructions

    def _parse_term(self) -> list[Instruction]:
        """term → factor (('*' | '/') factor)*"""
        instructions = self._parse_factor()
        while self._match(TokenType.STAR, TokenType.SLASH):
            op_tok = self._advance()
            instructions.extend(self._parse_factor())
            if op_tok.type == TokenType.STAR:
                instructions.append(Instruction(OpCode.MUL))
            else:
                instructions.append(Instruction(OpCode.DIV))
        return instructions

    def _parse_factor(self) -> list[Instruction]:
        """factor → NUMBER | IDENTIFIER | '(' expr ')'"""
        tok = self._current()

        if tok.type == TokenType.NUMBER:
            self._advance()
            value = float(tok.value) if "." in tok.value else int(tok.value)
            return [Instruction(OpCode.PUSH, value)]

        if tok.type == TokenType.IDENTIFIER:
            self._advance()
            return [Instruction(OpCode.LOAD, tok.value)]

        if tok.type == TokenType.LPAREN:
            self._advance()
            instructions = self._parse_expr()
            self._expect(TokenType.RPAREN)
            return instructions

        raise CompilerError(
            f"Factor inesperado '{tok.value}' ({tok.type.name}) "
            f"en línea {tok.line}."
        )

    # ------------------------------------------------------------------ #
    # Helpers                                                              #
    # ------------------------------------------------------------------ #

    def _expect_brace(self, brace: str) -> None:
        """Consume '{' o '}' exactamente; lanza CompilerError si no."""
        from models.stack_token import TokenType as TT
        expected = TT.LBRACE if brace == "{" else TT.RBRACE
        tok = self._current()
        if tok.type != expected:
            raise CompilerError(
                f"Se esperaba '{brace}' pero se encontró "
                f"'{tok.value}' en línea {tok.line}."
            )
        self._advance()
