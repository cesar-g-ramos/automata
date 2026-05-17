"""
Módulo Lexer (Analizador Léxico) para el Intérprete de Pila.

Transforma el código fuente en texto plano en una secuencia ordenada
de objetos Token. Implementa un autómata de estados finito manual
que avanza carácter a carácter, clasificando cada lexema en su
TokenType correspondiente y registrando la línea de origen.
"""

from models.stack_token import Token, TokenType, KEYWORDS


class LexerError(Exception):
    """Excepción lanzada ante un carácter o lexema inesperado."""
    pass


class Lexer:
    """Analizador léxico del lenguaje simple de pila.

    Attributes:
        _source (str): Código fuente completo.
        _pos    (int): Posición actual del cursor dentro de _source.
        _line   (int): Número de línea actual (base 1).
    """

    def __init__(self, source: str):
        """Recibe el código fuente y posiciona el cursor al inicio."""
        self._source = source
        self._pos    = 0
        self._line   = 1

    # ------------------------------------------------------------------ #
    # Interfaz pública                                                     #
    # ------------------------------------------------------------------ #

    def tokenize(self) -> list[Token]:
        """Convierte todo el fuente en una lista de Tokens.

        Returns:
            list[Token]: Secuencia de tokens terminada en EOF.

        Raises:
            LexerError: Si se encuentra un carácter no reconocido.
        """
        tokens: list[Token] = []
        while True:
            tok = self._next_token()
            tokens.append(tok)
            if tok.type == TokenType.EOF:
                break
        return tokens

    # ------------------------------------------------------------------ #
    # Lógica interna                                                       #
    # ------------------------------------------------------------------ #

    def _current(self) -> str:
        """Carácter bajo el cursor, o cadena vacía si llegamos al final."""
        if self._pos < len(self._source):
            return self._source[self._pos]
        return ""

    def _advance(self) -> str:
        """Consume y retorna el carácter actual; actualiza línea si es \\n."""
        ch = self._current()
        self._pos += 1
        if ch == "\n":
            self._line += 1
        return ch

    def _peek(self) -> str:
        """Mira el siguiente carácter sin consumirlo."""
        nxt = self._pos + 1
        if nxt < len(self._source):
            return self._source[nxt]
        return ""

    def _skip_whitespace_and_comments(self) -> None:
        """Salta espacios, tabulaciones, saltos de línea y comentarios (#)."""
        while self._current():
            ch = self._current()
            if ch in " \t\r\n":
                self._advance()
            elif ch == "#":                     # comentario de línea
                while self._current() and self._current() != "\n":
                    self._advance()
            else:
                break

    def _read_number(self) -> Token:
        """Lee un literal numérico entero o decimal."""
        start_line = self._line
        buf = ""
        while self._current().isdigit():
            buf += self._advance()
        if self._current() == "." and self._peek().isdigit():
            buf += self._advance()              # consume el punto
            while self._current().isdigit():
                buf += self._advance()
        return Token(TokenType.NUMBER, buf, start_line)

    def _read_identifier_or_keyword(self) -> Token:
        """Lee un identificador o palabra clave."""
        start_line = self._line
        buf = ""
        while self._current().isalnum() or self._current() == "_":
            buf += self._advance()
        token_type = KEYWORDS.get(buf, TokenType.IDENTIFIER)
        return Token(token_type, buf, start_line)

    def _next_token(self) -> Token:
        """Despacha el próximo token según el carácter actual.

        Returns:
            Token: El siguiente token leído.

        Raises:
            LexerError: Carácter no reconocido.
        """
        self._skip_whitespace_and_comments()
        line = self._line

        ch = self._current()

        if not ch:
            return Token(TokenType.EOF, "", line)

        # Números
        if ch.isdigit():
            return self._read_number()

        # Identificadores y palabras clave
        if ch.isalpha() or ch == "_":
            return self._read_identifier_or_keyword()

        # Operadores de uno o dos caracteres
        self._advance()

        if ch == "+": return Token(TokenType.PLUS,   "+", line)
        if ch == "-": return Token(TokenType.MINUS,  "-", line)
        if ch == "*": return Token(TokenType.STAR,   "*", line)
        if ch == "/": return Token(TokenType.SLASH,  "/", line)
        if ch == "(": return Token(TokenType.LPAREN, "(", line)
        if ch == ")": return Token(TokenType.RPAREN, ")", line)
        if ch == "{": return Token(TokenType.LBRACE, "{", line)
        if ch == "}": return Token(TokenType.RBRACE, "}", line)

        # Operadores que pueden ser de dos caracteres
        nxt = self._current()

        if ch == "=":
            if nxt == "=": self._advance(); return Token(TokenType.EQ,  "==", line)
            return Token(TokenType.ASSIGN, "=", line)

        if ch == "!":
            if nxt == "=": self._advance(); return Token(TokenType.NEQ, "!=", line)

        if ch == "<":
            if nxt == "=": self._advance(); return Token(TokenType.LTE, "<=", line)
            return Token(TokenType.LT, "<", line)

        if ch == ">":
            if nxt == "=": self._advance(); return Token(TokenType.GTE, ">=", line)
            return Token(TokenType.GT, ">", line)

        raise LexerError(f"Carácter inesperado '{ch}' en línea {line}")
