"""
Módulo de Tokens para el Intérprete de Pila.

Define las unidades léxicas (tokens) que el Lexer produce al analizar
el código fuente del lenguaje simple. Cada Token encapsula su tipo
(TokenType), su valor textual y la línea de origen, facilitando
mensajes de error precisos y la trazabilidad durante la compilación.
"""


class TokenType(Enum):
    """Enumeración de todos los tipos de token del lenguaje."""

    # Literales y nombres
    NUMBER     = auto()   # 42, 3.14
    IDENTIFIER = auto()   # x, resultado, contador

    # Operadores aritméticos
    PLUS       = auto()   # +
    MINUS      = auto()   # -
    STAR       = auto()   # *
    SLASH      = auto()   # /

    # Comparadores (para IF / WHILE)
    EQ         = auto()   # ==
    NEQ        = auto()   # !=
    LT         = auto()   # <
    GT         = auto()   # >
    LTE        = auto()   # <=
    GTE        = auto()   # >=

    # Asignación
    ASSIGN     = auto()   # =

    # Agrupadores
    LPAREN     = auto()   # (
    RPAREN     = auto()   # )
    LBRACE     = auto()   # {
    RBRACE     = auto()   # }

    # Palabras clave
    IF         = auto()   # if
    ELSE       = auto()   # else
    WHILE      = auto()   # while

    # Control de flujo
    EOF        = auto()   # fin de programa


# Palabras reservadas del lenguaje → su TokenType correspondiente
KEYWORDS: dict[str, TokenType] = {
    "if":    TokenType.IF,
    "else":  TokenType.ELSE,
    "while": TokenType.WHILE,
}


class Token:
    """Unidad léxica producida por el Lexer.

    Attributes:
        type  (TokenType): Categoría semántica del token.
        value (str):       Texto original tal como aparece en el fuente.
        line  (int):       Número de línea (base 1) donde fue encontrado.
    """

    def __init__(self, token_type: TokenType, value: str, line: int = 1):
        """Inicializa el token con su tipo, valor y línea."""
        self.type  = token_type
        self.value = value
        self.line  = line

    def __repr__(self) -> str:
        """Representación legible para depuración y traza."""
        return f"Token({self.type.name}, {self.value!r}, línea={self.line})"
