const projectData = [
    {
        "filename": "lexer.py",
        "module_doc": "Módulo de Análisis Léxico - Generador de Tokens.\n\nEste componente se encarga de transformar la cadena de texto de entrada\n(código fuente) en una secuencia de unidades atómicas llamadas Tokens.\nManeja la detección de números, operadores matemáticos, paréntesis y\nla gestión de espacios en blanco, reportando errores ante caracteres inválidos.",
        "classes": [
            {
                "name": "Token",
                "doc": "Representa un componente léxico (Token) identificado por el Lexer.\n\nEsta clase sirve como un contenedor simple para almacenar la categoría\ny el contenido semántico de cada unidad mínima del lenguaje.\n\n\n**Atributos:**\n    type (str): Categoría del token (ej. 'PLUS', 'NUM', 'EOF').\n    value (any): El valor asociado al token (ej. 10, '+', None).",
                "methods": [
                    {
                        "name": "__init__",
                        "doc": "Inicializa una instancia de Token.\n\n\n**Argumentos:**\n    type_ (str): El tipo de token.\n    value (any): El valor literal o numérico del token."
                    },
                    {
                        "name": "__repr__",
                        "doc": "Devuelve una representación legible del Token para depuración."
                    }
                ]
            },
            {
                "name": "Lexer",
                "doc": "Analizador léxico (Scanner).\n\nSe encarga de realizar el escaneo de una cadena de caracteres para\nagruparlos en unidades con significado léxico (tokens) basándose en\nun conjunto de operadores predefinidos y reglas de reconocimiento.\n\n\n**Atributos:**\n    expression (str): La cadena de texto de entrada a analizar.\n    position (int): El índice actual del puntero de lectura en la expresión.\n    tokens (list): La lista de objetos Token generados tras el análisis.\n    OPERATORS (dict): Mapeo de caracteres individuales a sus nombres de tipo.",
                "methods": [
                    {
                        "name": "__init__",
                        "doc": "Inicializa el Lexer con la expresión de entrada.\n\n\n**Argumentos:**\n    expression (str): El código fuente o expresión matemática a tokenizar."
                    },
                    {
                        "name": "tokenize",
                        "doc": "Recorre la expresión de entrada y genera una lista de Tokens.\n\nEste método implementa el bucle principal del analizador, ignorando\nespacios en blanco y manejando números, operadores y errores.\n\n\n**Retorna:**\n    list[Token]: Una lista de objetos Token que finaliza siempre con\n    un token de tipo 'EOF'."
                    },
                    {
                        "name": "_read_number",
                        "doc": "Lee una secuencia de dígitos desde la posición actual.\n\nEste método privado se utiliza para consumir todos los dígitos\nconsecutivos y convertirlos en un único token numérico.\n\n\n**Retorna:**\n    Token: Un token de tipo 'NUM' con su valor convertido a entero (int)."
                    }
                ]
            }
        ],
        "functions": []
    },
    {
        "filename": "nodes.py",
        "module_doc": "Módulo de Nodos del AST - Representación Jerárquica del Código.\n\nDefine la estructura de los nodos que conforman el Árbol de Sintaxis Abstracta (AST).\nCada nodo representa una operación (suma, resta, potencia, etc.) o un valor numérico,\nimplementando el patrón de evaluación recursiva para calcular el resultado final de\nla expresión de manera semántica.",
        "classes": [
            {
                "name": "ASTNode",
                "doc": "Clase base abstracta para todos los nodos del árbol sintáctico.\n\nDefine la interfaz mínima que cualquier componente del árbol debe\nimplementar para permitir la evaluación y visualización jerárquica.",
                "methods": [
                    {
                        "name": "evaluate",
                        "doc": "Calcula el valor semántico del nodo.\n\n\n**Excepciones:**\n    NotImplementedError: Si la subclase no implementa su propia\n        lógica de evaluación."
                    },
                    {
                        "name": "display",
                        "doc": "Muestra de forma gráfica la estructura del árbol en la consola.\n\nEste método utiliza recursividad para imprimir una representación\nvisual (estilo carpetas de sistema operativo) del nodo y sus hijos.\n\n\n**Argumentos:**\n    prefix (str): Cadena de caracteres que precede a la línea actual.\n    is_last (bool): Indica si el nodo es el último hijo de su padre\n        para ajustar el dibujo del conector."
                    },
                    {
                        "name": "get_children",
                        "doc": "Retorna una lista de los nodos hijos de este componente.\n\n\n**Retorna:**\n    list[ASTNode]: Lista de nodos descendentes. Por defecto retorna\n    una lista vacía para nodos hoja (como números)."
                    }
                ]
            },
            {
                "name": "NumberNode",
                "doc": "Nodo hoja que representa un valor literal numérico.\n\n\n**Atributos:**\n    value (int/float): El valor numérico contenido en el token.",
                "methods": [
                    {
                        "name": "__init__",
                        "doc": "Inicializa el nodo a partir de un Token de tipo NUM.\n\n\n**Argumentos:**\n    token (Token): El token numérico generado por el Lexer."
                    },
                    {
                        "name": "evaluate",
                        "doc": "Retorna el valor literal del número.\n\n\n**Retorna:**\n    int/float: El valor numérico almacenado."
                    },
                    {
                        "name": "__str__",
                        "doc": "Representación visual del nodo hoja."
                    }
                ]
            },
            {
                "name": "BinaryOpNode",
                "doc": "Nodo interno que representa una operación aritmética binaria.\n\nEste nodo vincula dos subárboles (izquierdo y derecho) mediante\nun operador aritmético.\n\n\n**Atributos:**\n    left (ASTNode): Nodo que representa el operando izquierdo.\n    operator (str): Símbolo de la operación (ej. '+', '*', '^').\n    right (ASTNode): Nodo que representa el operando derecho.",
                "methods": [
                    {
                        "name": "__init__",
                        "doc": "Inicializa una operación binaria.\n\n\n**Argumentos:**\n    left (ASTNode): El nodo del lado izquierdo.\n    op_token (Token): El token que contiene el operador.\n    right (ASTNode): El nodo del lado derecho."
                    },
                    {
                        "name": "evaluate",
                        "doc": "Evalúa recursivamente los hijos y aplica la operación actual.\n\n\n**Retorna:**\n    int/float: El resultado de aplicar el operador a los valores\n    evaluados de los operandos izquierdo y derecho.\n\n\n**Excepciones:**\n    ZeroDivisionError: Si se intenta realizar una división por cero."
                    },
                    {
                        "name": "get_children",
                        "doc": "Provee acceso a los operandos para el método display.\n\n\n**Retorna:**\n    list[ASTNode]: Una lista con los nodos [izquierdo, derecho]."
                    },
                    {
                        "name": "__str__",
                        "doc": "Representación visual del operador en el árbol."
                    }
                ]
            }
        ],
        "functions": []
    },
    {
        "filename": "parser.py",
        "module_doc": "Módulo de Análisis Sintáctico - Motor de Descenso Recursivo.\n\nImplementa un analizador sintáctico que valida la estructura de la secuencia de\ntokens basándose en una gramática formal de expresiones matemáticas. Su función\nprincipal es construir el Árbol de Sintaxis Abstracta (AST) respetando la\nprecedencia de operadores y las reglas de asociatividad.",
        "classes": [
            {
                "name": "Parser",
                "doc": "Analizador Sintáctico (Parser) de Descenso Recursivo.\n\nEsta clase transforma una lista de tokens en un Árbol Sintáctico Abstracto (AST)\nsiguiendo las reglas de precedencia matemática estándar.\n\nLa gramática implementada (en orden de precedencia) es:\n\n1.  expression : term ((PLUS | MINUS) term)*\n2.  term       : power ((MULT | DIV) power)*\n3.  power      : factor (POW power)?\n4.  factor     : NUM | LPAREN expression RPAREN\n\n\n**Atributos:**\n    tokens (list): Lista de objetos Token provenientes del Lexer.\n    pos (int): Índice actual del token procesado.\n    indent_level (int): Nivel de sangría para trazado visual (opcional).",
                "methods": [
                    {
                        "name": "__init__",
                        "doc": "Inicializa el Parser con la secuencia de tokens.\n\n\n**Argumentos:**\n    tokens (list[Token]): Lista de tokens a procesar."
                    },
                    {
                        "name": "current_token",
                        "doc": "Retorna el token actual bajo el puntero de lectura.\n\n\n**Retorna:**\n    Token: El objeto Token en la posición actual."
                    },
                    {
                        "name": "eat",
                        "doc": "Verifica y consume el token actual si coincide con el tipo esperado.\n\n\n**Argumentos:**\n    token_type (str): El tipo de token esperado (ej. 'PLUS').\n\n\n**Retorna:**\n    Token: El token consumido exitosamente.\n\n\n**Excepciones:**\n    Exception: Si el token actual no coincide con el tipo esperado."
                    },
                    {
                        "name": "parse",
                        "doc": "Inicia el proceso de análisis sintáctico.\n\n\n**Retorna:**\n    ASTNode: El nodo raíz del Árbol Sintáctico Abstracto resultante."
                    },
                    {
                        "name": "expression",
                        "doc": "Procesa la regla de suma y resta.\n\nGramática: term ((PLUS | MINUS) term)*\n\n\n**Retorna:**\n    ASTNode: Un nodo de operación binaria o un término simple."
                    },
                    {
                        "name": "term",
                        "doc": "Procesa la regla de multiplicación y división.\n\nGramática: power ((MULT | DIV) power)*\n\n\n**Retorna:**\n    ASTNode: Un nodo de operación binaria o un nodo de potencia/factor."
                    },
                    {
                        "name": "power",
                        "doc": "Procesa la regla de potencia (exponenciación).\n\nGramática: factor (POW power)?\nNota: La potencia suele ser asociativa a la derecha.\n\n\n**Retorna:**\n    ASTNode: Un nodo de potencia o un factor simple."
                    },
                    {
                        "name": "factor",
                        "doc": "Procesa la unidad mínima: números o expresiones entre paréntesis.\n\nGramática: NUM | LPAREN expression RPAREN\n\n\n**Retorna:**\n    ASTNode: Un NumberNode o el resultado de una sub-expresión.\n\n\n**Excepciones:**\n    Exception: Si se encuentra un token que no corresponde a un factor."
                    }
                ]
            }
        ],
        "functions": []
    },
    {
        "filename": "main.py",
        "module_doc": "Módulo Principal - Orquestador del Compilador Simulado.\n\nEste script coordina las fases de análisis léxico, sintáctico y la\nevaluación semántica. Puede ejecutarse directamente pasando una\nexpresión como argumento de consola o usando una expresión por defecto.",
        "classes": [],
        "functions": [
            {
                "name": "run_pipeline",
                "doc": "Ejecuta el pipeline completo del compilador para una expresión dada.\n\nCoordina el Lexer para generar tokens, el Parser para construir el AST\ny finalmente evalúa el árbol para obtener un resultado numérico.\n\n\n**Argumentos:**\n    expression (str): La cadena de texto que contiene la expresión matemática."
            }
        ]
    }
];