const projectData = [
    {
        "filename": "main.py",
        "path": "main.py",
        "category": "Orquestador",
        "module_doc": "M\u00f3dulo Orquestador - Interfaz de Usuario y Control de Flujo.\n\nEste archivo act\u00faa como el punto de entrada principal (Main Entry Point) utilizando el framework Streamlit.\nSe encarga de inicializar la configuraci\u00f3n de la p\u00e1gina, gestionar el estado de la sesi\u00f3n y\ncoordinar la navegaci\u00f3n entre las vistas de An\u00e1lisis Matem\u00e1tico, Lenguajes Regulares\ne Int\u00e9rprete de Pila. Implementa el patr\u00f3n de dise\u00f1o Singleton para el manejo de la aplicaci\u00f3n.",
        "classes": [
            {
                "name": "CompilerApp",
                "doc": "Orquestador principal de la aplicaci\u00f3n.",
                "methods": [
                    {
                        "name": "__init__",
                        "doc": "Configuraci\u00f3n de p\u00e1gina y vistas.",
                        "code": "    def __init__(self):\n        \"\"\"Configuraci\u00f3n de p\u00e1gina y vistas.\"\"\"\n        st.set_page_config(page_title=\"Compiladores Lab Pro\", layout=\"wide\")\n        self.math_view        = MathView()\n        self.regex_view       = RegexView()\n        self.interpreter_view = StackInterpreterView()"
                    },
                    {
                        "name": "show_sidebar",
                        "doc": "Muestra las notas acad\u00e9micas.",
                        "code": "    def show_sidebar(self):\n        \"\"\"Muestra las notas acad\u00e9micas.\"\"\"\n        st.sidebar.markdown(\"### Notas Acad\u00e9micas\")\n        st.sidebar.write(\"\"\"\n        El **Algoritmo de Thompson** construye AFNs agregando estados auxiliares.\n        - Flechas grises (&epsilon;): Transiciones espont\u00e1neas.\n        - C\u00edrculo doble verde: Estado final.\n        - **Naranja:** Estados actuales.\n        \"\"\")\n        st.sidebar.markdown(\"---\")\n        st.sidebar.markdown(\"### Int\u00e9rprete de Pila\")\n        st.sidebar.write(\"\"\"\n        El int\u00e9rprete convierte c\u00f3digo fuente a **instrucciones de c\u00f3digo intermedio**\n        y las ejecuta sobre una pila, mostrando cada paso:\n        - `PUSH` \u2192 apila un valor literal.\n        - `LOAD` / `STORE` \u2192 lee o escribe variables.\n        - `ADD`, `SUB`, `MUL`, `DIV` \u2192 opera sobre el tope de la pila.\n        - `JUMP_IF_FALSE` \u2192 control de flujo (IF / WHILE).\n        \"\"\")"
                    },
                    {
                        "name": "run",
                        "doc": "Loop principal.",
                        "code": "    def run(self):\n        \"\"\"Loop principal.\"\"\"\n        st.title(\"\ud83c\udf93 Laboratorio de Teor\u00eda de Compiladores\")\n        self.show_sidebar()\n        \n        tabs = st.tabs([\n            \"\ud83e\uddee An\u00e1lisis Matem\u00e1tico\",\n            \"\ud83d\udd0d Lenguajes Regulares\",\n            \"\u2699\ufe0f Int\u00e9rprete de Pila\",\n        ])\n        with tabs[0]: self.math_view.show()\n        with tabs[1]: self.regex_view.show()\n        with tabs[2]: self.interpreter_view.show()"
                    }
                ],
                "attributes": [
                    "math_view",
                    "regex_view",
                    "interpreter_view"
                ]
            }
        ]
    },
    {
        "filename": "math_automata.py",
        "path": "models/math_automata.py",
        "category": "Modelo",
        "module_doc": "M\u00f3dulo de Aut\u00f3mata de Pila (PDA) para Validaci\u00f3n Algebraica.\n\nEste archivo implementa la l\u00f3gica de un Aut\u00f3mata de Pila encargado de validar la estructura\nsint\u00e1ctica de expresiones algebraicas. Se encarga de la clasificaci\u00f3n de caracteres (tokens),\nel manejo de transiciones entre estados y el control de agrupadores mediante una pila l\u00f3gica,\ngarantizando que la expresi\u00f3n sea matem\u00e1ticamente v\u00e1lida antes de su procesamiento.",
        "classes": [
            {
                "name": "MathAutomata",
                "doc": "Implementaci\u00f3n del Aut\u00f3mata de Pila para sintaxis algebraica.",
                "methods": [
                    {
                        "name": "__init__",
                        "doc": "Define estados y transiciones.",
                        "code": "    def __init__(self):\n        \"\"\"Define estados y transiciones.\"\"\"\n        self.transitions = {\n            \"q_init\": {\"signo\": \"q_num\", \"digito\": \"q_num\", \"letra\": \"q_var\", \"par_abierto\": \"q_init\"},\n            \"q_num\": {\"digito\": \"q_num\", \"punto\": \"q_num\", \"letra\": \"q_var\", \"operador\": \"q_init\", \n                      \"par_abierto\": \"q_init\", \"par_cerrado\": \"q_num\", \"igual\": \"q_init\"},\n            \"q_var\": {\"letra\": \"q_var\", \"digito\": \"q_var\", \"operador\": \"q_init\", \n                      \"par_abierto\": \"q_init\", \"par_cerrado\": \"q_num\", \"igual\": \"q_init\"},\n            \"q_error\": {}\n        }\n        self.estado_inicial = \"q_init\"\n        self.estados_aceptacion = [\"q_num\", \"q_var\"]"
                    },
                    {
                        "name": "get_char_type",
                        "doc": "Retorna el tipo de car\u00e1cter.",
                        "code": "    def get_char_type(self, char):\n        \"\"\"Retorna el tipo de car\u00e1cter.\"\"\"\n        if char.isdigit(): return \"digito\"\n        if char.isalpha(): return \"letra\"\n        if char in \"+-*/^\": return \"operador\"\n        if char == \"(\": return \"par_abierto\"\n        if char == \")\": return \"par_cerrado\"\n        if char == \".\": return \"punto\"\n        if char == \"=\": return \"igual\"\n        if char in \"+-\": return \"signo\"\n        return \"desconocido\""
                    },
                    {
                        "name": "process_to_tuples",
                        "doc": "An\u00e1lisis l\u00e9xico en tuplas.",
                        "code": "    def process_to_tuples(self, expression):\n        \"\"\"An\u00e1lisis l\u00e9xico en tuplas.\"\"\"\n        items = re.findall(r'[0-9.]+|[a-zA-Z][a-zA-Z0-9]*|[\\+\\-\\*/\\^=\\(\\)]', expression)\n        tokens = []\n        for item in items:\n            t_type = \"OPERADOR\"\n            if item.replace('.', '', 1).isdigit(): t_type = \"NUMERO\"\n            elif item.isalpha() or (item[0].isalpha() and item.isalnum()): t_type = \"VARIABLE\"\n            elif item in \"()\": t_type = \"AGRUPADOR\"\n            elif item == \"=\": t_type = \"IGUALDAD\"\n            tokens.append((t_type, item))\n        return tokens"
                    },
                    {
                        "name": "validate",
                        "doc": "Valida la cadena y devuelve historial.",
                        "code": "    def validate(self, expression):\n        \"\"\"Valida la cadena y devuelve historial.\"\"\"\n        current_state = self.estado_inicial\n        history = [{\"Car\u00e1cter\": \"Inicio\", \"Tipo\": \"-\", \"Estado\": current_state, \"Pila\": \"[]\"}]\n        stack = []\n        clean_expr = expression.replace(\" \", \"\")\n        for char in clean_expr:\n            char_type = self.get_char_type(char)\n            if char_type == \"par_abierto\": stack.append(\"(\")\n            elif char_type == \"par_cerrado\":\n                if not stack: current_state = \"q_error\"\n                else: stack.pop()\n            if char_type in \"+-\" and current_state == \"q_init\": char_type = \"signo\"\n            if current_state != \"q_error\":\n                current_state = self.transitions.get(current_state, {}).get(char_type, \"q_error\")\n            history.append({\"Car\u00e1cter\": char, \"Tipo\": char_type, \"Estado\": current_state, \"Pila\": str(list(stack))})\n            if current_state == \"q_error\": break\n        return (current_state in self.estados_aceptacion and len(stack) == 0), history"
                    }
                ],
                "attributes": [
                    "transitions",
                    "estado_inicial",
                    "estados_aceptacion"
                ]
            }
        ]
    },
    {
        "filename": "math_engine.py",
        "path": "models/math_engine.py",
        "category": "Modelo",
        "module_doc": "M\u00f3dulo de Motor Simb\u00f3lico Computacional.\n\nEste componente act\u00faa como el n\u00facleo de procesamiento matem\u00e1tico del sistema. Utiliza la\nlibrer\u00eda SymPy para realizar operaciones de c\u00e1lculo simb\u00f3lico avanzado, incluyendo\nsimplificaci\u00f3n de expresiones, evaluaci\u00f3n num\u00e9rica con sustituci\u00f3n de variables y\nresoluci\u00f3n de ecuaciones algebraicas, transformando entradas textuales en resultados matem\u00e1ticos precisos.",
        "classes": [
            {
                "name": "MathEngine",
                "doc": "Motor de c\u00e1lculo simb\u00f3lico utilizando SymPy.",
                "methods": [
                    {
                        "name": "prepare_for_sympy",
                        "doc": "Ajusta la cadena para ser procesada por SymPy.\n\n\n**Argumentos:**\n    expr (str): Expresi\u00f3n ingresada por el usuario.\n\n\n**Retorna:**\n    str: Expresi\u00f3n formateada para SymPy.",
                        "code": "    def prepare_for_sympy(self, expr):\n        \"\"\"Ajusta la cadena para ser procesada por SymPy.\n\n        Args:\n            expr (str): Expresi\u00f3n ingresada por el usuario.\n\n        Returns:\n            str: Expresi\u00f3n formateada para SymPy.\n        \"\"\"\n        processed = expr.replace(\"^\", \"**\")\n        processed = re.sub(r'(\\d)([a-zA-Z])', r'\\1*\\2', processed)\n        processed = re.sub(r'([a-zA-Z])([a-zA-Z])', r'\\1*\\2', processed)\n        processed = re.sub(r'(\\))(\\()', r'\\1*\\2', processed)\n        processed = re.sub(r'(\\d)(\\()', r'\\1*\\2', processed)\n        return processed"
                    },
                    {
                        "name": "_format_solutions",
                        "doc": "Convierte el objeto de soluci\u00f3n de SymPy en un formato amigable.\n\n\n**Argumentos:**\n    solutions: Objeto devuelto por sp.solve (lista, dict, etc).\n\n\n**Retorna:**\n    str: Representaci\u00f3n legible de las soluciones.",
                        "code": "    def _format_solutions(self, solutions):\n        \"\"\"Convierte el objeto de soluci\u00f3n de SymPy en un formato amigable.\n\n        Args:\n            solutions: Objeto devuelto por sp.solve (lista, dict, etc).\n\n        Returns:\n            str: Representaci\u00f3n legible de las soluciones.\n        \"\"\"\n        if not solutions:\n            return \"No se encontraron soluciones reales.\"\n        \n        # Caso de sistemas de ecuaciones (Diccionario)\n        if isinstance(solutions, dict):\n            parts = [f\"{sp.latex(var)} = {sp.latex(val)}\" for var, val in solutions.items()]\n            return \", \".join(parts)\n        \n        # Caso de lista de soluciones (Ecuaci\u00f3n de una variable)\n        if isinstance(solutions, list):\n            # Si la lista contiene diccionarios (sistemas complejos)\n            if solutions and isinstance(solutions[0], dict):\n                all_sols = []\n                for sol in solutions:\n                    parts = [f\"{sp.latex(k)} = {sp.latex(v)}\" for k, v in sol.items()]\n                    all_sols.append(f\"({', '.join(parts)})\")\n                return \" \u00f3 \".join(all_sols)\n            \n            # Si es una lista de valores simples [x1, x2]\n            formatted_values = [sp.latex(s) for s in solutions]\n            return \" , \".join(formatted_values)\n\n        return str(solutions)"
                    },
                    {
                        "name": "solve_symbolic",
                        "doc": "Resuelve la expresi\u00f3n seg\u00fan el modo solicitado.\n\n\n**Argumentos:**\n    expr (str): Expresi\u00f3n matem\u00e1tica.\n    mode (str): Modo ('reduce', 'evaluate', 'solve').\n    var_values (dict): Valores para sustituci\u00f3n.\n\n\n**Retorna:**\n    Any: Resultado procesado (cadena formateada o valor num\u00e9rico).",
                        "code": "    def solve_symbolic(self, expr, mode=\"reduce\", var_values=None):\n        \"\"\"Resuelve la expresi\u00f3n seg\u00fan el modo solicitado.\n\n        Args:\n            expr (str): Expresi\u00f3n matem\u00e1tica.\n            mode (str): Modo ('reduce', 'evaluate', 'solve').\n            var_values (dict): Valores para sustituci\u00f3n.\n\n        Returns:\n            Any: Resultado procesado (cadena formateada o valor num\u00e9rico).\n        \"\"\"\n        try:\n            p_expr = self.prepare_for_sympy(expr)\n            if mode == \"reduce\":\n                if \"=\" in p_expr:\n                    l, r = p_expr.split(\"=\")\n                    return f\"{sp.expand(l)} = {sp.expand(r)}\"\n                return sp.expand(p_expr)\n            \n            elif mode == \"evaluate\":\n                target = p_expr.split(\"=\")[0] if \"=\" in p_expr else p_expr\n                s_expr = sp.sympify(target)\n                return s_expr.subs(var_values) if var_values else s_expr.evalf()\n            \n            elif mode == \"solve\":\n                if \"=\" in p_expr:\n                    left, right = p_expr.split(\"=\")\n                    equation = sp.Eq(sp.sympify(left), sp.sympify(right))\n                    raw_solutions = sp.solve(equation)\n                    return self._format_solutions(raw_solutions)\n                return \"No es una ecuaci\u00f3n.\"\n        except Exception as e:\n            return f\"Error: {e}\""
                    }
                ],
                "attributes": []
            }
        ]
    },
    {
        "filename": "regex_engine.py",
        "path": "models/regex_engine.py",
        "category": "Modelo",
        "module_doc": "M\u00f3dulo Orquestador de Lenguajes Regulares.\n\nEste archivo coordina el flujo completo para el procesamiento de expresiones regulares.\nIntegra el constructor de Thompson para transformar una Regex en un Aut\u00f3mata Finito\nNo Determinista (AFN) y proporciona la l\u00f3gica de simulaci\u00f3n necesaria para validar\ncadenas de texto, calculando clausuras \u00e9psilon y transiciones de estados activos.",
        "classes": [
            {
                "name": "RegexEngine",
                "doc": "Orquestador para el procesamiento de expresiones regulares.",
                "methods": [
                    {
                        "name": "__init__",
                        "doc": "Inicializa el motor con el constructor de Thompson.",
                        "code": "    def __init__(self):\n        \"\"\"Inicializa el motor con el constructor de Thompson.\"\"\"\n        self.builder = ThompsonBuilder()"
                    },
                    {
                        "name": "get_epsilon_closure",
                        "doc": "Calcula la clausura \u00e9psilon de un conjunto de estados.",
                        "code": "    def get_epsilon_closure(self, nodes):\n        \"\"\"Calcula la clausura \u00e9psilon de un conjunto de estados.\"\"\"\n        closure = set(nodes)\n        stack = list(nodes)\n        while stack:\n            node = stack.pop()\n            for eps_node in node.epsilon_transitions:\n                if eps_node not in closure:\n                    closure.add(eps_node)\n                    stack.append(eps_node)\n        return closure"
                    },
                    {
                        "name": "parse_regex_to_afn",
                        "doc": "Parser que convierte la regex en una estructura AFN.",
                        "code": "    def parse_regex_to_afn(self, regex):\n        \"\"\"Parser que convierte la regex en una estructura AFN.\"\"\"\n        stack = []\n        i = 0\n        while i < len(regex):\n            char = regex[i]\n            if char.isalnum():\n                stack.append(self.builder.build_basic(char))\n            elif char == '*':\n                if stack:\n                    s, e = stack.pop()\n                    stack.append(self.builder.build_kleene(s, e))\n            elif char == '+':\n                if stack:\n                    s, e = stack.pop()\n                    stack.append(self.builder.build_positive(s, e))\n            elif char == '|':\n                if i + 1 < len(regex) and stack:\n                    s1, e1 = stack.pop()\n                    char2 = regex[i+1]\n                    s2, e2 = self.builder.build_basic(char2)\n                    stack.append(self.builder.build_union(s1, e1, s2, e2))\n                    i += 1 \n            i += 1\n        \n        if not stack: return None, None\n        res_s, res_e = stack[0]\n        for next_s, next_e in stack[1:]:\n            res_s, res_e = self.builder.build_concat(res_s, res_e, next_s, next_e)\n        return res_s, res_e"
                    },
                    {
                        "name": "simulate_afn",
                        "doc": "Simula el AFN devolviendo el historial de estados activos.",
                        "code": "    def simulate_afn(self, start_node, chain):\n        \"\"\"Simula el AFN devolviendo el historial de estados activos.\"\"\"\n        current_states = self.get_epsilon_closure([start_node])\n        history = [{\"Car\u00e1cter\": \"Inicio\", \"Estados\": current_states}]\n        \n        for char in chain:\n            next_states = set()\n            for node in current_states:\n                if char in node.transitions:\n                    for target in node.transitions[char]:\n                        next_states.add(target)\n            current_states = self.get_epsilon_closure(next_states)\n            history.append({\"Car\u00e1cter\": char, \"Estados\": current_states})\n            if not current_states: break\n        return history"
                    }
                ],
                "attributes": [
                    "builder"
                ]
            }
        ]
    },
    {
        "filename": "regex_node.py",
        "path": "models/regex_node.py",
        "category": "Modelo",
        "module_doc": "M\u00f3dulo de Estructura de Datos para Nodos de Aut\u00f3mata.\n\nDefine la unidad m\u00ednima de un Aut\u00f3mata Finito: el Nodo o Estado. Cada instancia\nalmacena un identificador \u00fanico y gestiona sus propias transiciones, permitiendo\ntanto saltos por caracteres espec\u00edficos como transiciones espont\u00e1neas (\u00e9psilon).\nEs la base estructural sobre la cual se construye la red de estados del algoritmo de Thompson.",
        "classes": [
            {
                "name": "RegexNode",
                "doc": "Representa un estado en el aut\u00f3mata de Thompson.\n\nAttributes:\n    id (int): Identificador \u00fanico del nodo.\n    name (str): Nombre del estado (s0, s1, etc.).\n    transitions (dict): Diccionario de transiciones por car\u00e1cter.\n    epsilon_transitions (list): Lista de nodos alcanzables por \u00e9psilon.",
                "methods": [
                    {
                        "name": "__init__",
                        "doc": "Inicializa el nodo con un ID.",
                        "code": "    def __init__(self, node_id):\n        \"\"\"Inicializa el nodo con un ID.\"\"\"\n        self.id = node_id\n        self.name = f\"s{node_id}\"\n        self.transitions = {}  \n        self.epsilon_transitions = [] "
                    },
                    {
                        "name": "add_transition",
                        "doc": "Agrega una transici\u00f3n por car\u00e1cter.",
                        "code": "    def add_transition(self, char, node):\n        \"\"\"Agrega una transici\u00f3n por car\u00e1cter.\"\"\"\n        if char not in self.transitions:\n            self.transitions[char] = []\n        self.transitions[char].append(node)"
                    },
                    {
                        "name": "add_epsilon",
                        "doc": "Agrega una transici\u00f3n \u00e9psilon.",
                        "code": "    def add_epsilon(self, node):\n        \"\"\"Agrega una transici\u00f3n \u00e9psilon.\"\"\"\n        self.epsilon_transitions.append(node)"
                    }
                ],
                "attributes": [
                    "id",
                    "name",
                    "transitions",
                    "epsilon_transitions"
                ]
            }
        ]
    },
    {
        "filename": "thompson_builder.py",
        "path": "models/thompson_builder.py",
        "category": "Modelo",
        "module_doc": "M\u00f3dulo Constructor del Algoritmo de Thompson.\n\nImplementa las reglas formales del Algoritmo de Thompson para la construcci\u00f3n sistem\u00e1tica\nde AFNs. Provee m\u00e9todos est\u00e1ticos para generar fragmentos de aut\u00f3mata para operaciones\nb\u00e1sicas, uniones (OR), concatenaciones y cierres (Kleene y Positivo), permitiendo la\ncomposici\u00f3n modular de estructuras complejas a partir de expresiones regulares simples.",
        "classes": [
            {
                "name": "ThompsonBuilder",
                "doc": "Generador de AFN basado en la estructura de la Regex (Algoritmo de Thompson).",
                "methods": [
                    {
                        "name": "__init__",
                        "doc": "Inicializa el contador de nodos.",
                        "code": "    def __init__(self):\n        \"\"\"Inicializa el contador de nodos.\"\"\"\n        self.node_count = 0"
                    },
                    {
                        "name": "create_node",
                        "doc": "Crea un nuevo nodo con ID incremental.",
                        "code": "    def create_node(self):\n        \"\"\"Crea un nuevo nodo con ID incremental.\"\"\"\n        node = RegexNode(self.node_count)\n        self.node_count += 1\n        return node"
                    },
                    {
                        "name": "build_basic",
                        "doc": "Construye un AFN b\u00e1sico para un car\u00e1cter.",
                        "code": "    def build_basic(self, char):\n        \"\"\"Construye un AFN b\u00e1sico para un car\u00e1cter.\"\"\"\n        start = self.create_node()\n        end = self.create_node()\n        start.add_transition(char, end)\n        return start, end"
                    },
                    {
                        "name": "build_union",
                        "doc": "Construye la uni\u00f3n de dos fragmentos de AFN.",
                        "code": "    def build_union(self, start1, end1, start2, end2):\n        \"\"\"Construye la uni\u00f3n de dos fragmentos de AFN.\"\"\"\n        start = self.create_node()\n        end = self.create_node()\n        start.add_epsilon(start1)\n        start.add_epsilon(start2)\n        end1.add_epsilon(end)\n        end2.add_epsilon(end)\n        return start, end"
                    },
                    {
                        "name": "build_concat",
                        "doc": "Concatena dos fragmentos de AFN.",
                        "code": "    def build_concat(self, start1, end1, start2, end2):\n        \"\"\"Concatena dos fragmentos de AFN.\"\"\"\n        end1.add_epsilon(start2)\n        return start1, end2"
                    },
                    {
                        "name": "build_kleene",
                        "doc": "Aplica el cierre de Kleene (*).",
                        "code": "    def build_kleene(self, start_inner, end_inner):\n        \"\"\"Aplica el cierre de Kleene (*).\"\"\"\n        start = self.create_node()\n        end = self.create_node()\n        start.add_epsilon(start_inner)\n        start.add_epsilon(end)\n        end_inner.add_epsilon(start_inner)\n        end_inner.add_epsilon(end)\n        return start, end"
                    },
                    {
                        "name": "build_positive",
                        "doc": "Aplica el cierre positivo (+).",
                        "code": "    def build_positive(self, start_inner, end_inner):\n        \"\"\"Aplica el cierre positivo (+).\"\"\"\n        start = self.create_node()\n        end = self.create_node()\n        start.add_epsilon(start_inner)\n        end_inner.add_epsilon(start_inner)\n        end_inner.add_epsilon(end)\n        return start, end"
                    }
                ],
                "attributes": [
                    "node_count"
                ]
            }
        ]
    },
    {
        "filename": "stack_token.py",
        "path": "models/stack_token.py",
        "category": "Modelo",
        "module_doc": "M\u00f3dulo de Tokens para el Int\u00e9rprete de Pila.\n\nDefine las unidades l\u00e9xicas (tokens) que el Lexer produce al analizar\nel c\u00f3digo fuente del lenguaje simple. Cada Token encapsula su tipo\n(TokenType), su valor textual y la l\u00ednea de origen, facilitando\nmensajes de error precisos y la trazabilidad durante la compilaci\u00f3n.",
        "classes": [
            {
                "name": "TokenType",
                "doc": "Enumeraci\u00f3n de todos los tipos de token del lenguaje.",
                "methods": [],
                "attributes": []
            },
            {
                "name": "Token",
                "doc": "Unidad l\u00e9xica producida por el Lexer.\n\nAttributes:\n    type  (TokenType): Categor\u00eda sem\u00e1ntica del token.\n    value (str):       Texto original tal como aparece en el fuente.\n    line  (int):       N\u00famero de l\u00ednea (base 1) donde fue encontrado.",
                "methods": [
                    {
                        "name": "__init__",
                        "doc": "Inicializa el token con su tipo, valor y l\u00ednea.",
                        "code": "    def __init__(self, token_type: TokenType, value: str, line: int = 1):\n        \"\"\"Inicializa el token con su tipo, valor y l\u00ednea.\"\"\"\n        self.type  = token_type\n        self.value = value\n        self.line  = line"
                    },
                    {
                        "name": "__repr__",
                        "doc": "Representaci\u00f3n legible para depuraci\u00f3n y traza.",
                        "code": "    def __repr__(self) -> str:\n        \"\"\"Representaci\u00f3n legible para depuraci\u00f3n y traza.\"\"\"\n        return f\"Token({self.type.name}, {self.value!r}, l\u00ednea={self.line})\""
                    }
                ],
                "attributes": [
                    "type",
                    "value",
                    "line"
                ]
            }
        ]
    },
    {
        "filename": "stack_lexer.py",
        "path": "models/stack_lexer.py",
        "category": "Modelo",
        "module_doc": "M\u00f3dulo Lexer (Analizador L\u00e9xico) para el Int\u00e9rprete de Pila.\n\nTransforma el c\u00f3digo fuente en texto plano en una secuencia ordenada\nde objetos Token. Implementa un aut\u00f3mata de estados finito manual\nque avanza car\u00e1cter a car\u00e1cter, clasificando cada lexema en su\nTokenType correspondiente y registrando la l\u00ednea de origen.",
        "classes": [
            {
                "name": "LexerError",
                "doc": "Excepci\u00f3n lanzada ante un car\u00e1cter o lexema inesperado.",
                "methods": [],
                "attributes": []
            },
            {
                "name": "Lexer",
                "doc": "Analizador l\u00e9xico del lenguaje simple de pila.\n\nAttributes:\n    _source (str): C\u00f3digo fuente completo.\n    _pos    (int): Posici\u00f3n actual del cursor dentro de _source.\n    _line   (int): N\u00famero de l\u00ednea actual (base 1).",
                "methods": [
                    {
                        "name": "__init__",
                        "doc": "Recibe el c\u00f3digo fuente y posiciona el cursor al inicio.",
                        "code": "    def __init__(self, source: str):\n        \"\"\"Recibe el c\u00f3digo fuente y posiciona el cursor al inicio.\"\"\"\n        self._source = source\n        self._pos    = 0\n        self._line   = 1"
                    },
                    {
                        "name": "tokenize",
                        "doc": "Convierte todo el fuente en una lista de Tokens.\n\n\n**Retorna:**\n    list[Token]: Secuencia de tokens terminada en EOF.\n\nRaises:\n    LexerError: Si se encuentra un car\u00e1cter no reconocido.",
                        "code": "    def tokenize(self) -> list[Token]:\n        \"\"\"Convierte todo el fuente en una lista de Tokens.\n\n        Returns:\n            list[Token]: Secuencia de tokens terminada en EOF.\n\n        Raises:\n            LexerError: Si se encuentra un car\u00e1cter no reconocido.\n        \"\"\"\n        tokens: list[Token] = []\n        while True:\n            tok = self._next_token()\n            tokens.append(tok)\n            if tok.type == TokenType.EOF:\n                break\n        return tokens"
                    },
                    {
                        "name": "_current",
                        "doc": "Car\u00e1cter bajo el cursor, o cadena vac\u00eda si llegamos al final.",
                        "code": "    def _current(self) -> str:\n        \"\"\"Car\u00e1cter bajo el cursor, o cadena vac\u00eda si llegamos al final.\"\"\"\n        if self._pos < len(self._source):\n            return self._source[self._pos]\n        return \"\""
                    },
                    {
                        "name": "_advance",
                        "doc": "Consume y retorna el car\u00e1cter actual; actualiza l\u00ednea si es \\n.",
                        "code": "    def _advance(self) -> str:\n        \"\"\"Consume y retorna el car\u00e1cter actual; actualiza l\u00ednea si es \\\\n.\"\"\"\n        ch = self._current()\n        self._pos += 1\n        if ch == \"\\n\":\n            self._line += 1\n        return ch"
                    },
                    {
                        "name": "_peek",
                        "doc": "Mira el siguiente car\u00e1cter sin consumirlo.",
                        "code": "    def _peek(self) -> str:\n        \"\"\"Mira el siguiente car\u00e1cter sin consumirlo.\"\"\"\n        nxt = self._pos + 1\n        if nxt < len(self._source):\n            return self._source[nxt]\n        return \"\""
                    },
                    {
                        "name": "_skip_whitespace_and_comments",
                        "doc": "Salta espacios, tabulaciones, saltos de l\u00ednea y comentarios (#).",
                        "code": "    def _skip_whitespace_and_comments(self) -> None:\n        \"\"\"Salta espacios, tabulaciones, saltos de l\u00ednea y comentarios (#).\"\"\"\n        while self._current():\n            ch = self._current()\n            if ch in \" \\t\\r\\n\":\n                self._advance()\n            elif ch == \"#\":                     # comentario de l\u00ednea\n                while self._current() and self._current() != \"\\n\":\n                    self._advance()\n            else:\n                break"
                    },
                    {
                        "name": "_read_number",
                        "doc": "Lee un literal num\u00e9rico entero o decimal.",
                        "code": "    def _read_number(self) -> Token:\n        \"\"\"Lee un literal num\u00e9rico entero o decimal.\"\"\"\n        start_line = self._line\n        buf = \"\"\n        while self._current().isdigit():\n            buf += self._advance()\n        if self._current() == \".\" and self._peek().isdigit():\n            buf += self._advance()              # consume el punto\n            while self._current().isdigit():\n                buf += self._advance()\n        return Token(TokenType.NUMBER, buf, start_line)"
                    },
                    {
                        "name": "_read_identifier_or_keyword",
                        "doc": "Lee un identificador o palabra clave.",
                        "code": "    def _read_identifier_or_keyword(self) -> Token:\n        \"\"\"Lee un identificador o palabra clave.\"\"\"\n        start_line = self._line\n        buf = \"\"\n        while self._current().isalnum() or self._current() == \"_\":\n            buf += self._advance()\n        token_type = KEYWORDS.get(buf, TokenType.IDENTIFIER)\n        return Token(token_type, buf, start_line)"
                    },
                    {
                        "name": "_next_token",
                        "doc": "Despacha el pr\u00f3ximo token seg\u00fan el car\u00e1cter actual.\n\n\n**Retorna:**\n    Token: El siguiente token le\u00eddo.\n\nRaises:\n    LexerError: Car\u00e1cter no reconocido.",
                        "code": "    def _next_token(self) -> Token:\n        \"\"\"Despacha el pr\u00f3ximo token seg\u00fan el car\u00e1cter actual.\n\n        Returns:\n            Token: El siguiente token le\u00eddo.\n\n        Raises:\n            LexerError: Car\u00e1cter no reconocido.\n        \"\"\"\n        self._skip_whitespace_and_comments()\n        line = self._line\n\n        ch = self._current()\n\n        if not ch:\n            return Token(TokenType.EOF, \"\", line)\n\n        # N\u00fameros\n        if ch.isdigit():\n            return self._read_number()\n\n        # Identificadores y palabras clave\n        if ch.isalpha() or ch == \"_\":\n            return self._read_identifier_or_keyword()\n\n        # Operadores de uno o dos caracteres\n        self._advance()\n\n        if ch == \"+\": return Token(TokenType.PLUS,   \"+\", line)\n        if ch == \"-\": return Token(TokenType.MINUS,  \"-\", line)\n        if ch == \"*\": return Token(TokenType.STAR,   \"*\", line)\n        if ch == \"/\": return Token(TokenType.SLASH,  \"/\", line)\n        if ch == \"(\": return Token(TokenType.LPAREN, \"(\", line)\n        if ch == \")\": return Token(TokenType.RPAREN, \")\", line)\n        if ch == \"{\": return Token(TokenType.LBRACE, \"{\", line)\n        if ch == \"}\": return Token(TokenType.RBRACE, \"}\", line)\n\n        # Operadores que pueden ser de dos caracteres\n        nxt = self._current()\n\n        if ch == \"=\":\n            if nxt == \"=\": self._advance(); return Token(TokenType.EQ,  \"==\", line)\n            return Token(TokenType.ASSIGN, \"=\", line)\n\n        if ch == \"!\":\n            if nxt == \"=\": self._advance(); return Token(TokenType.NEQ, \"!=\", line)\n\n        if ch == \"<\":\n            if nxt == \"=\": self._advance(); return Token(TokenType.LTE, \"<=\", line)\n            return Token(TokenType.LT, \"<\", line)\n\n        if ch == \">\":\n            if nxt == \"=\": self._advance(); return Token(TokenType.GTE, \">=\", line)\n            return Token(TokenType.GT, \">\", line)\n\n        raise LexerError(f\"Car\u00e1cter inesperado '{ch}' en l\u00ednea {line}\")"
                    }
                ],
                "attributes": [
                    "_source",
                    "_pos",
                    "_line"
                ]
            }
        ]
    },
    {
        "filename": "stack_instruction.py",
        "path": "models/stack_instruction.py",
        "category": "Modelo",
        "module_doc": "M\u00f3dulo de Instrucciones de C\u00f3digo Intermedio para el Int\u00e9rprete de Pila.\n\nDefine el conjunto de operaciones (OpCode) que el StackCompiler genera\ny el StackInterpreter ejecuta. Cada Instruction agrupa un OpCode con su\noperando opcional, representando la unidad m\u00ednima de ejecuci\u00f3n del\nlenguaje intermedio basado en pila.",
        "classes": [
            {
                "name": "OpCode",
                "doc": "Conjunto de instrucciones del lenguaje intermedio de pila.",
                "methods": [],
                "attributes": []
            },
            {
                "name": "Instruction",
                "doc": "Unidad de c\u00f3digo intermedio ejecutable por el StackInterpreter.\n\nAttributes:\n    opcode  (OpCode): Operaci\u00f3n a realizar.\n    operand (Any):    Argumento opcional (literal, nombre de variable\n                      o etiqueta de salto). None si no aplica.",
                "methods": [
                    {
                        "name": "__init__",
                        "doc": "Inicializa la instrucci\u00f3n con su opcode y operando.",
                        "code": "    def __init__(self, opcode: OpCode, operand: Any = None):\n        \"\"\"Inicializa la instrucci\u00f3n con su opcode y operando.\"\"\"\n        self.opcode  = opcode\n        self.operand = operand"
                    },
                    {
                        "name": "__repr__",
                        "doc": "Representaci\u00f3n de una l\u00ednea para la columna 'Instrucci\u00f3n' de la traza.",
                        "code": "    def __repr__(self) -> str:\n        \"\"\"Representaci\u00f3n de una l\u00ednea para la columna 'Instrucci\u00f3n' de la traza.\"\"\"\n        label = OPCODE_LABELS.get(self.opcode, self.opcode.name)\n        if self.operand is not None:\n            return f\"{label}  {self.operand}\"\n        return label"
                    }
                ],
                "attributes": [
                    "opcode",
                    "operand"
                ]
            }
        ]
    },
    {
        "filename": "stack_structure.py",
        "path": "models/stack_structure.py",
        "category": "Modelo",
        "module_doc": "M\u00f3dulo de Estructura de Datos Pila (Stack) para el Int\u00e9rprete.\n\nImplementa la pila como clase con encapsulamiento completo, exponiendo\nsolo las operaciones necesarias (push, pop, peek, is_empty, snapshot).\nEl m\u00e9todo snapshot permite capturar el estado de la pila en cada paso\nde ejecuci\u00f3n sin exponer la lista interna.",
        "classes": [
            {
                "name": "StackUnderflowError",
                "doc": "Lanzada cuando se intenta hacer pop/peek en una pila vac\u00eda.",
                "methods": [],
                "attributes": []
            },
            {
                "name": "Stack",
                "doc": "Estructura de datos pila con soporte de instant\u00e1neas para trazas.\n\nAttributes:\n    _data (list): Lista interna; el tope est\u00e1 en el \u00faltimo \u00edndice.",
                "methods": [
                    {
                        "name": "__init__",
                        "doc": "Inicializa la pila vac\u00eda.",
                        "code": "    def __init__(self):\n        \"\"\"Inicializa la pila vac\u00eda.\"\"\"\n        self._data: list[Any] = []"
                    },
                    {
                        "name": "push",
                        "doc": "Apila un valor en el tope.\n\n\n**Argumentos:**\n    value: Valor a insertar (n\u00famero, booleano, etc.).",
                        "code": "    def push(self, value: Any) -> None:\n        \"\"\"Apila un valor en el tope.\n\n        Args:\n            value: Valor a insertar (n\u00famero, booleano, etc.).\n        \"\"\"\n        self._data.append(value)"
                    },
                    {
                        "name": "pop",
                        "doc": "Retira y retorna el valor del tope.\n\n\n**Retorna:**\n    Any: El valor que estaba en el tope.\n\nRaises:\n    StackUnderflowError: Si la pila est\u00e1 vac\u00eda.",
                        "code": "    def pop(self) -> Any:\n        \"\"\"Retira y retorna el valor del tope.\n\n        Returns:\n            Any: El valor que estaba en el tope.\n\n        Raises:\n            StackUnderflowError: Si la pila est\u00e1 vac\u00eda.\n        \"\"\"\n        if self.is_empty():\n            raise StackUnderflowError(\"Operaci\u00f3n pop sobre pila vac\u00eda.\")\n        return self._data.pop()"
                    },
                    {
                        "name": "peek",
                        "doc": "Retorna el valor del tope sin retirarlo.\n\n\n**Retorna:**\n    Any: El valor en el tope.\n\nRaises:\n    StackUnderflowError: Si la pila est\u00e1 vac\u00eda.",
                        "code": "    def peek(self) -> Any:\n        \"\"\"Retorna el valor del tope sin retirarlo.\n\n        Returns:\n            Any: El valor en el tope.\n\n        Raises:\n            StackUnderflowError: Si la pila est\u00e1 vac\u00eda.\n        \"\"\"\n        if self.is_empty():\n            raise StackUnderflowError(\"Operaci\u00f3n peek sobre pila vac\u00eda.\")\n        return self._data[-1]"
                    },
                    {
                        "name": "is_empty",
                        "doc": "Indica si la pila no contiene elementos.",
                        "code": "    def is_empty(self) -> bool:\n        \"\"\"Indica si la pila no contiene elementos.\"\"\"\n        return len(self._data) == 0"
                    },
                    {
                        "name": "snapshot",
                        "doc": "Devuelve una copia del estado actual de la pila.\n\nEl primer elemento de la lista es el fondo; el \u00faltimo es el tope.\nLa vista invierte la lista para mostrar el tope arriba.\n\n\n**Retorna:**\n    list[Any]: Copia inmutable del contenido de la pila.",
                        "code": "    def snapshot(self) -> list[Any]:\n        \"\"\"Devuelve una copia del estado actual de la pila.\n\n        El primer elemento de la lista es el fondo; el \u00faltimo es el tope.\n        La vista invierte la lista para mostrar el tope arriba.\n\n        Returns:\n            list[Any]: Copia inmutable del contenido de la pila.\n        \"\"\"\n        return list(self._data)"
                    },
                    {
                        "name": "__len__",
                        "doc": "N\u00famero de elementos en la pila.",
                        "code": "    def __len__(self) -> int:\n        \"\"\"N\u00famero de elementos en la pila.\"\"\"\n        return len(self._data)"
                    },
                    {
                        "name": "__repr__",
                        "doc": "Representaci\u00f3n visual con el tope al final.",
                        "code": "    def __repr__(self) -> str:\n        \"\"\"Representaci\u00f3n visual con el tope al final.\"\"\"\n        return f\"Stack({self._data}  \u2190 tope)\""
                    }
                ],
                "attributes": []
            }
        ]
    },
    {
        "filename": "stack_compiler.py",
        "path": "models/stack_compiler.py",
        "category": "Modelo",
        "module_doc": "M\u00f3dulo Compilador de C\u00f3digo Intermedio para el Int\u00e9rprete de Pila.\n\nEl StackCompiler recibe el c\u00f3digo fuente como cadena de texto, invoca\nal Lexer para obtener la secuencia de Tokens y luego aplica un parser\nde descenso recursivo para generar la lista de Instrucciones de c\u00f3digo\nintermedio (OpCode). Soporta asignaciones, expresiones aritm\u00e9ticas,\nbloques IF/ELSE y ciclos WHILE.\n\nGram\u00e1tica soportada (BNF simplificado):\n    program    \u2192 statement*\n    statement  \u2192 assign | if_stmt | while_stmt\n    assign     \u2192 IDENTIFIER '=' expr\n    if_stmt    \u2192 'if' '(' condition ')' '{' program '}' ('else' '{' program '}')?\n    while_stmt \u2192 'while' '(' condition ')' '{' program '}'\n    condition  \u2192 expr comparator expr\n    comparator \u2192 '==' | '!=' | '<' | '>' | '<=' | '>='\n    expr       \u2192 term (('+' | '-') term)*\n    term       \u2192 factor (('*' | '/') factor)*\n    factor     \u2192 NUMBER | IDENTIFIER | '(' expr ')'",
        "classes": [
            {
                "name": "CompilerError",
                "doc": "Excepci\u00f3n lanzada ante errores sint\u00e1cticos durante la compilaci\u00f3n.",
                "methods": [],
                "attributes": []
            },
            {
                "name": "StackCompiler",
                "doc": "Compilador de c\u00f3digo fuente a instrucciones de pila.\n\nAttributes:\n    _lexer  (Lexer):       Analizador l\u00e9xico.\n    _tokens (list[Token]): Secuencia de tokens producida por el Lexer.\n    _pos    (int):         Cursor sobre _tokens.\n    _label  (int):         Contador de etiquetas \u00fanicas para saltos.",
                "methods": [
                    {
                        "name": "__init__",
                        "doc": "Inicializa el compilador; los datos se cargan en compile().",
                        "code": "    def __init__(self):\n        \"\"\"Inicializa el compilador; los datos se cargan en compile().\"\"\"\n        self._lexer:  Lexer        = None\n        self._tokens: list[Token]  = []\n        self._pos:    int          = 0\n        self._label:  int          = 0"
                    },
                    {
                        "name": "compile",
                        "doc": "Compila el c\u00f3digo fuente y retorna la lista de instrucciones.\n\n\n**Argumentos:**\n    source (str): C\u00f3digo fuente del lenguaje simple.\n\n\n**Retorna:**\n    list[Instruction]: Programa en c\u00f3digo intermedio de pila.\n\nRaises:\n    LexerError:    Car\u00e1cter no reconocido.\n    CompilerError: Error sint\u00e1ctico.",
                        "code": "    def compile(self, source: str) -> list[Instruction]:\n        \"\"\"Compila el c\u00f3digo fuente y retorna la lista de instrucciones.\n\n        Args:\n            source (str): C\u00f3digo fuente del lenguaje simple.\n\n        Returns:\n            list[Instruction]: Programa en c\u00f3digo intermedio de pila.\n\n        Raises:\n            LexerError:    Car\u00e1cter no reconocido.\n            CompilerError: Error sint\u00e1ctico.\n        \"\"\"\n        self._lexer  = Lexer(source)\n        self._tokens = self._lexer.tokenize()\n        self._pos    = 0\n        self._label  = 0\n        return self._parse_program()"
                    },
                    {
                        "name": "_current",
                        "doc": "Token en la posici\u00f3n actual.",
                        "code": "    def _current(self) -> Token:\n        \"\"\"Token en la posici\u00f3n actual.\"\"\"\n        if self._pos < len(self._tokens):\n            return self._tokens[self._pos]\n        return self._tokens[-1]   # EOF"
                    },
                    {
                        "name": "_advance",
                        "doc": "Consume y retorna el token actual.",
                        "code": "    def _advance(self) -> Token:\n        \"\"\"Consume y retorna el token actual.\"\"\"\n        tok = self._current()\n        self._pos += 1\n        return tok"
                    },
                    {
                        "name": "_expect",
                        "doc": "Consume el token actual si su tipo coincide; lanza error si no.\n\n\n**Argumentos:**\n    token_type: Tipo esperado.\n\n\n**Retorna:**\n    Token: El token consumido.\n\nRaises:\n    CompilerError: Si el tipo no coincide.",
                        "code": "    def _expect(self, token_type: TokenType) -> Token:\n        \"\"\"Consume el token actual si su tipo coincide; lanza error si no.\n\n        Args:\n            token_type: Tipo esperado.\n\n        Returns:\n            Token: El token consumido.\n\n        Raises:\n            CompilerError: Si el tipo no coincide.\n        \"\"\"\n        tok = self._current()\n        if tok.type != token_type:\n            raise CompilerError(\n                f\"Se esperaba '{token_type.name}' \"\n                f\"pero se encontr\u00f3 '{tok.type.name}' ('{tok.value}') \"\n                f\"en l\u00ednea {tok.line}.\"\n            )\n        return self._advance()"
                    },
                    {
                        "name": "_match",
                        "doc": "Retorna True si el token actual es de alguno de los tipos dados.",
                        "code": "    def _match(self, *types: TokenType) -> bool:\n        \"\"\"Retorna True si el token actual es de alguno de los tipos dados.\"\"\"\n        return self._current().type in types"
                    },
                    {
                        "name": "_new_label",
                        "doc": "Genera una etiqueta \u00fanica para saltos.",
                        "code": "    def _new_label(self, prefix: str = \"L\") -> str:\n        \"\"\"Genera una etiqueta \u00fanica para saltos.\"\"\"\n        self._label += 1\n        return f\"{prefix}{self._label}\""
                    },
                    {
                        "name": "_parse_program",
                        "doc": "Parsea una secuencia de sentencias hasta EOF o '}'.",
                        "code": "    def _parse_program(self) -> list[Instruction]:\n        \"\"\"Parsea una secuencia de sentencias hasta EOF o '}'.\"\"\"\n        instructions: list[Instruction] = []\n        while not self._match(TokenType.EOF):\n            # RBRACE marca fin de bloque IF/ELSE/WHILE \u2014 lo maneja el padre\n            if self._match(TokenType.RBRACE):\n                break\n            instructions.extend(self._parse_statement())\n        return instructions"
                    },
                    {
                        "name": "_parse_statement",
                        "doc": "Despacha al parser de sentencia correspondiente.",
                        "code": "    def _parse_statement(self) -> list[Instruction]:\n        \"\"\"Despacha al parser de sentencia correspondiente.\"\"\"\n        tok = self._current()\n\n        if tok.type == TokenType.IF:\n            return self._parse_if()\n\n        if tok.type == TokenType.WHILE:\n            return self._parse_while()\n\n        if tok.type == TokenType.IDENTIFIER:\n            # Puede ser asignaci\u00f3n: IDENTIFIER '=' expr\n            return self._parse_assign()\n\n        raise CompilerError(\n            f\"Sentencia inesperada '{tok.value}' en l\u00ednea {tok.line}. \"\n            \"Se esperaba una asignaci\u00f3n, 'if' o 'while'.\"\n        )"
                    },
                    {
                        "name": "_parse_assign",
                        "doc": "Parsea: IDENTIFIER '=' expr  \u2192  [c\u00f3digo de expr] + STORE <var>.",
                        "code": "    def _parse_assign(self) -> list[Instruction]:\n        \"\"\"Parsea: IDENTIFIER '=' expr  \u2192  [c\u00f3digo de expr] + STORE <var>.\"\"\"\n        name = self._expect(TokenType.IDENTIFIER).value\n        self._expect(TokenType.ASSIGN)\n        instructions = self._parse_expr()\n        instructions.append(Instruction(OpCode.STORE, name))\n        return instructions"
                    },
                    {
                        "name": "_parse_if",
                        "doc": "Parsea: if ( condition ) { program } [ else { program } ].",
                        "code": "    def _parse_if(self) -> list[Instruction]:\n        \"\"\"Parsea: if ( condition ) { program } [ else { program } ].\"\"\"\n        self._expect(TokenType.IF)\n        self._expect(TokenType.LPAREN)\n        instructions = self._parse_condition()\n        self._expect(TokenType.RPAREN)\n\n        label_else = self._new_label(\"ELSE\")\n        label_end  = self._new_label(\"END_IF\")\n\n        instructions.append(Instruction(OpCode.JUMP_IF_FALSE, label_else))\n\n        # Bloque then\n        self._expect_brace(\"{\")\n        instructions.extend(self._parse_program())\n        self._expect_brace(\"}\")\n\n        instructions.append(Instruction(OpCode.JUMP, label_end))\n        instructions.append(Instruction(OpCode.LABEL, label_else))\n\n        # Bloque else (opcional)\n        if self._match(TokenType.ELSE):\n            self._advance()\n            self._expect_brace(\"{\")\n            instructions.extend(self._parse_program())\n            self._expect_brace(\"}\")\n\n        instructions.append(Instruction(OpCode.LABEL, label_end))\n        return instructions"
                    },
                    {
                        "name": "_parse_while",
                        "doc": "Parsea: while ( condition ) { program }.",
                        "code": "    def _parse_while(self) -> list[Instruction]:\n        \"\"\"Parsea: while ( condition ) { program }.\"\"\"\n        self._expect(TokenType.WHILE)\n        self._expect(TokenType.LPAREN)\n\n        label_start = self._new_label(\"WHILE_START\")\n        label_end   = self._new_label(\"WHILE_END\")\n\n        instructions: list[Instruction] = []\n        instructions.append(Instruction(OpCode.LABEL, label_start))\n\n        instructions.extend(self._parse_condition())\n        self._expect(TokenType.RPAREN)\n\n        instructions.append(Instruction(OpCode.JUMP_IF_FALSE, label_end))\n\n        self._expect_brace(\"{\")\n        instructions.extend(self._parse_program())\n        self._expect_brace(\"}\")\n\n        instructions.append(Instruction(OpCode.JUMP, label_start))\n        instructions.append(Instruction(OpCode.LABEL, label_end))\n        return instructions"
                    },
                    {
                        "name": "_parse_condition",
                        "doc": "Parsea: expr comparator expr \u2192 apila 1 (verdadero) o 0 (falso).",
                        "code": "    def _parse_condition(self) -> list[Instruction]:\n        \"\"\"Parsea: expr comparator expr \u2192 apila 1 (verdadero) o 0 (falso).\"\"\"\n        instructions = self._parse_expr()\n\n        # Mapa de TokenType comparador \u2192 OpCode CMP\n        cmp_map = {\n            TokenType.EQ:  OpCode.CMP_EQ,\n            TokenType.NEQ: OpCode.CMP_NEQ,\n            TokenType.LT:  OpCode.CMP_LT,\n            TokenType.GT:  OpCode.CMP_GT,\n            TokenType.LTE: OpCode.CMP_LTE,\n            TokenType.GTE: OpCode.CMP_GTE,\n        }\n\n        if self._current().type not in cmp_map:\n            raise CompilerError(\n                f\"Se esperaba un comparador (==, !=, <, >, <=, >=) \"\n                f\"pero se encontr\u00f3 '{self._current().value}' \"\n                f\"en l\u00ednea {self._current().line}.\"\n            )\n\n        op = cmp_map[self._advance().type]\n        instructions.extend(self._parse_expr())\n        instructions.append(Instruction(op))\n        return instructions"
                    },
                    {
                        "name": "_parse_expr",
                        "doc": "expr \u2192 term (('+' | '-') term)*",
                        "code": "    def _parse_expr(self) -> list[Instruction]:\n        \"\"\"expr \u2192 term (('+' | '-') term)*\"\"\"\n        instructions = self._parse_term()\n        while self._match(TokenType.PLUS, TokenType.MINUS):\n            op_tok = self._advance()\n            instructions.extend(self._parse_term())\n            if op_tok.type == TokenType.PLUS:\n                instructions.append(Instruction(OpCode.ADD))\n            else:\n                instructions.append(Instruction(OpCode.SUB))\n        return instructions"
                    },
                    {
                        "name": "_parse_term",
                        "doc": "term \u2192 factor (('*' | '/') factor)*",
                        "code": "    def _parse_term(self) -> list[Instruction]:\n        \"\"\"term \u2192 factor (('*' | '/') factor)*\"\"\"\n        instructions = self._parse_factor()\n        while self._match(TokenType.STAR, TokenType.SLASH):\n            op_tok = self._advance()\n            instructions.extend(self._parse_factor())\n            if op_tok.type == TokenType.STAR:\n                instructions.append(Instruction(OpCode.MUL))\n            else:\n                instructions.append(Instruction(OpCode.DIV))\n        return instructions"
                    },
                    {
                        "name": "_parse_factor",
                        "doc": "factor \u2192 NUMBER | IDENTIFIER | '(' expr ')'",
                        "code": "    def _parse_factor(self) -> list[Instruction]:\n        \"\"\"factor \u2192 NUMBER | IDENTIFIER | '(' expr ')'\"\"\"\n        tok = self._current()\n\n        if tok.type == TokenType.NUMBER:\n            self._advance()\n            value = float(tok.value) if \".\" in tok.value else int(tok.value)\n            return [Instruction(OpCode.PUSH, value)]\n\n        if tok.type == TokenType.IDENTIFIER:\n            self._advance()\n            return [Instruction(OpCode.LOAD, tok.value)]\n\n        if tok.type == TokenType.LPAREN:\n            self._advance()\n            instructions = self._parse_expr()\n            self._expect(TokenType.RPAREN)\n            return instructions\n\n        raise CompilerError(\n            f\"Factor inesperado '{tok.value}' ({tok.type.name}) \"\n            f\"en l\u00ednea {tok.line}.\"\n        )"
                    },
                    {
                        "name": "_expect_brace",
                        "doc": "Consume '{' o '}' exactamente; lanza CompilerError si no.",
                        "code": "    def _expect_brace(self, brace: str) -> None:\n        \"\"\"Consume '{' o '}' exactamente; lanza CompilerError si no.\"\"\"\n        from models.stack_token import TokenType as TT\n        expected = TT.LBRACE if brace == \"{\" else TT.RBRACE\n        tok = self._current()\n        if tok.type != expected:\n            raise CompilerError(\n                f\"Se esperaba '{brace}' pero se encontr\u00f3 \"\n                f\"'{tok.value}' en l\u00ednea {tok.line}.\"\n            )\n        self._advance()"
                    }
                ],
                "attributes": []
            }
        ]
    },
    {
        "filename": "stack_interpreter.py",
        "path": "models/stack_interpreter.py",
        "category": "Modelo",
        "module_doc": "M\u00f3dulo Int\u00e9rprete de Pila (StackInterpreter).\n\nEjecuta la lista de Instrucciones generadas por el StackCompiler,\nmanteniendo la pila de ejecuci\u00f3n (Stack) y la memoria de variables\n(dict). Produce un ExecutionStep por cada instrucci\u00f3n ejecutada,\npermitiendo a la vista reproducir la traza paso a paso de forma\ncompletamente desacoplada del motor de ejecuci\u00f3n.",
        "classes": [
            {
                "name": "InterpreterError",
                "doc": "Excepci\u00f3n en tiempo de ejecuci\u00f3n del int\u00e9rprete.",
                "methods": [],
                "attributes": []
            },
            {
                "name": "ExecutionStep",
                "doc": "Instant\u00e1nea del estado de la m\u00e1quina tras ejecutar una instrucci\u00f3n.\n\nAttributes:\n    step_num         (int):         N\u00famero de paso (base 0).\n    instruction      (Instruction): Instrucci\u00f3n que se acaba de ejecutar.\n    stack_snapshot   (list):        Copia del contenido de la pila.\n    memory_snapshot  (dict):        Copia del mapa de variables.\n    result           (Any):         Valor calculado si aplica, None si no.\n    error            (str | None):  Mensaje de error si hubo excepci\u00f3n.",
                "methods": [
                    {
                        "name": "__init__",
                        "doc": "Sin descripci\u00f3n t\u00e9cnica disponible.",
                        "code": "    def __init__(\n        self,\n        step_num: int,\n        instruction: Instruction,\n        stack_snapshot: list[Any],\n        memory_snapshot: dict[str, Any],\n        result: Any = None,\n        error: str | None = None,\n    ):\n        self.step_num        = step_num\n        self.instruction     = instruction\n        self.stack_snapshot  = stack_snapshot\n        self.memory_snapshot = memory_snapshot\n        self.result          = result\n        self.error           = error"
                    },
                    {
                        "name": "describe",
                        "doc": "Descripci\u00f3n en lenguaje natural del paso para el usuario.\n\n\n**Retorna:**\n    str: Frase explicativa de la operaci\u00f3n realizada.",
                        "code": "    def describe(self) -> str:\n        \"\"\"Descripci\u00f3n en lenguaje natural del paso para el usuario.\n\n        Returns:\n            str: Frase explicativa de la operaci\u00f3n realizada.\n        \"\"\"\n        op = self.instruction.opcode\n        arg = self.instruction.operand\n\n        descriptions = {\n            OpCode.PUSH:          f\"Se apila el valor {arg}\",\n            OpCode.POP:           \"Se descarta el valor del tope\",\n            OpCode.LOAD:          f\"Se carga la variable '{arg}' \u2192 {self.result}\",\n            OpCode.STORE:         f\"Se guarda el tope en la variable '{arg}'\",\n            OpCode.ADD:           f\"Se suma: resultado = {self.result}\",\n            OpCode.SUB:           f\"Se resta: resultado = {self.result}\",\n            OpCode.MUL:           f\"Se multiplica: resultado = {self.result}\",\n            OpCode.DIV:           f\"Se divide: resultado = {self.result}\",\n            OpCode.CMP_EQ:        f\"Comparaci\u00f3n ==: {'verdadero' if self.result else 'falso'}\",\n            OpCode.CMP_NEQ:       f\"Comparaci\u00f3n !=: {'verdadero' if self.result else 'falso'}\",\n            OpCode.CMP_LT:        f\"Comparaci\u00f3n <:  {'verdadero' if self.result else 'falso'}\",\n            OpCode.CMP_GT:        f\"Comparaci\u00f3n >:  {'verdadero' if self.result else 'falso'}\",\n            OpCode.CMP_LTE:       f\"Comparaci\u00f3n <=: {'verdadero' if self.result else 'falso'}\",\n            OpCode.CMP_GTE:       f\"Comparaci\u00f3n >=: {'verdadero' if self.result else 'falso'}\",\n            OpCode.JUMP:          f\"Salto incondicional \u2192 {arg}\",\n            OpCode.JUMP_IF_FALSE: f\"Condici\u00f3n {'falsa \u2192 salta' if self.result == 'jumped' else 'verdadera \u2192 contin\u00faa'} ({arg})\",\n            OpCode.LABEL:         f\"Etiqueta '{arg}' alcanzada\",\n        }\n\n        if self.error:\n            return f\"Error: {self.error}\"\n        return descriptions.get(op, repr(self.instruction))"
                    }
                ],
                "attributes": [
                    "step_num",
                    "instruction",
                    "stack_snapshot",
                    "memory_snapshot",
                    "result",
                    "error"
                ]
            },
            {
                "name": "StackInterpreter",
                "doc": "Int\u00e9rprete de instrucciones de pila con ejecuci\u00f3n paso a paso.\n\nAttributes:\n    _stack        (Stack):              Pila de ejecuci\u00f3n.\n    _memory       (dict[str, Any]):     Memoria de variables.\n    _instructions (list[Instruction]):  Programa cargado.\n    _ip           (int):               Puntero de instrucci\u00f3n actual.\n    _label_map    (dict[str, int]):    Mapa de etiqueta \u2192 \u00edndice.",
                "methods": [
                    {
                        "name": "__init__",
                        "doc": "Inicializa el int\u00e9rprete en estado limpio.",
                        "code": "    def __init__(self):\n        \"\"\"Inicializa el int\u00e9rprete en estado limpio.\"\"\"\n        self._stack:        Stack                  = Stack()\n        self._memory:       dict[str, Any]         = {}\n        self._instructions: list[Instruction]      = []\n        self._ip:           int                    = 0\n        self._label_map:    dict[str, int]         = {}"
                    },
                    {
                        "name": "run",
                        "doc": "Ejecuta el programa completo y retorna todos los pasos.\n\n\n**Argumentos:**\n    instructions: Lista de instrucciones generada por StackCompiler.\n\n\n**Retorna:**\n    list[ExecutionStep]: Traza completa de la ejecuci\u00f3n.",
                        "code": "    def run(self, instructions: list[Instruction]) -> list[ExecutionStep]:\n        \"\"\"Ejecuta el programa completo y retorna todos los pasos.\n\n        Args:\n            instructions: Lista de instrucciones generada por StackCompiler.\n\n        Returns:\n            list[ExecutionStep]: Traza completa de la ejecuci\u00f3n.\n        \"\"\"\n        self.reset()\n        self._instructions = instructions\n        self._build_label_map()\n\n        steps: list[ExecutionStep] = []\n        guard = 0\n\n        while self._ip < len(self._instructions):\n            guard += 1\n            if guard > self.MAX_STEPS:\n                steps.append(ExecutionStep(\n                    step_num=len(steps),\n                    instruction=self._instructions[self._ip],\n                    stack_snapshot=self._stack.snapshot(),\n                    memory_snapshot=dict(self._memory),\n                    error=f\"L\u00edmite de {self.MAX_STEPS} pasos alcanzado. \u00bfCiclo infinito?\",\n                ))\n                break\n\n            step = self.step()\n            steps.append(step)\n            if step.error:\n                break\n\n        return steps"
                    },
                    {
                        "name": "step",
                        "doc": "Ejecuta la instrucci\u00f3n actual y avanza el puntero.\n\n\n**Retorna:**\n    ExecutionStep: Estado tras la ejecuci\u00f3n de la instrucci\u00f3n.",
                        "code": "    def step(self) -> ExecutionStep:\n        \"\"\"Ejecuta la instrucci\u00f3n actual y avanza el puntero.\n\n        Returns:\n            ExecutionStep: Estado tras la ejecuci\u00f3n de la instrucci\u00f3n.\n        \"\"\"\n        instr  = self._instructions[self._ip]\n        result = None\n        error  = None\n\n        try:\n            result = self._execute(instr)\n        except (StackUnderflowError, InterpreterError, ZeroDivisionError) as exc:\n            error = str(exc)\n\n        step = ExecutionStep(\n            step_num=self._ip,\n            instruction=instr,\n            stack_snapshot=self._stack.snapshot(),\n            memory_snapshot=dict(self._memory),\n            result=result,\n            error=error,\n        )\n\n        if not error:\n            self._ip += 1\n\n        return step"
                    },
                    {
                        "name": "reset",
                        "doc": "Reinicia el int\u00e9rprete a estado inicial.",
                        "code": "    def reset(self) -> None:\n        \"\"\"Reinicia el int\u00e9rprete a estado inicial.\"\"\"\n        self._stack        = Stack()\n        self._memory       = {}\n        self._instructions = []\n        self._ip           = 0\n        self._label_map    = {}"
                    },
                    {
                        "name": "_build_label_map",
                        "doc": "Precompila el mapa etiqueta \u2192 \u00edndice para saltos O(1).",
                        "code": "    def _build_label_map(self) -> None:\n        \"\"\"Precompila el mapa etiqueta \u2192 \u00edndice para saltos O(1).\"\"\"\n        self._label_map = {}\n        for idx, instr in enumerate(self._instructions):\n            if instr.opcode == OpCode.LABEL:\n                self._label_map[instr.operand] = idx"
                    },
                    {
                        "name": "_execute",
                        "doc": "Despacha la instrucci\u00f3n a su manejador; retorna valor relevante.",
                        "code": "    def _execute(self, instr: Instruction) -> Any:\n        \"\"\"Despacha la instrucci\u00f3n a su manejador; retorna valor relevante.\"\"\"\n        op  = instr.opcode\n        arg = instr.operand\n\n        # \u2500\u2500 Pila \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\n        if op == OpCode.PUSH:\n            self._stack.push(arg)\n            return arg\n\n        if op == OpCode.POP:\n            return self._stack.pop()\n\n        # \u2500\u2500 Memoria \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\n        if op == OpCode.LOAD:\n            if arg not in self._memory:\n                raise InterpreterError(\n                    f\"Variable '{arg}' no definida. \"\n                    \"As\u00edgnala antes de usarla.\"\n                )\n            value = self._memory[arg]\n            self._stack.push(value)\n            return value\n\n        if op == OpCode.STORE:\n            value = self._stack.pop()\n            self._memory[arg] = value\n            return value\n\n        # \u2500\u2500 Aritm\u00e9tica \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\n        if op in (OpCode.ADD, OpCode.SUB, OpCode.MUL, OpCode.DIV):\n            b = self._stack.pop()\n            a = self._stack.pop()\n            if op == OpCode.ADD: res = a + b\n            elif op == OpCode.SUB: res = a - b\n            elif op == OpCode.MUL: res = a * b\n            else:\n                if b == 0:\n                    raise InterpreterError(\"Divisi\u00f3n por cero.\")\n                res = a / b\n                # Convertir a entero si el resultado es exacto\n                if isinstance(res, float) and res.is_integer():\n                    res = int(res)\n            self._stack.push(res)\n            return res\n\n        # \u2500\u2500 Comparaci\u00f3n \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\n        cmp_ops = {\n            OpCode.CMP_EQ:  lambda a, b: a == b,\n            OpCode.CMP_NEQ: lambda a, b: a != b,\n            OpCode.CMP_LT:  lambda a, b: a <  b,\n            OpCode.CMP_GT:  lambda a, b: a >  b,\n            OpCode.CMP_LTE: lambda a, b: a <= b,\n            OpCode.CMP_GTE: lambda a, b: a >= b,\n        }\n        if op in cmp_ops:\n            b = self._stack.pop()\n            a = self._stack.pop()\n            res = 1 if cmp_ops[op](a, b) else 0\n            self._stack.push(res)\n            return res\n\n        # \u2500\u2500 Saltos \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\n        if op == OpCode.JUMP:\n            self._ip = self._label_map[arg] - 1  # -1 porque step() sumar\u00e1 1\n            return f\"\u2192 {arg}\"\n\n        if op == OpCode.JUMP_IF_FALSE:\n            cond = self._stack.pop()\n            if not cond:\n                self._ip = self._label_map[arg] - 1\n                return \"jumped\"\n            return \"continue\"\n\n        # \u2500\u2500 Etiquetas \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\n        if op == OpCode.LABEL:\n            return f\"[{arg}]\"   # sin efecto en ejecuci\u00f3n; solo marcador\n\n        raise InterpreterError(f\"OpCode desconocido: {op}\")"
                    }
                ],
                "attributes": []
            }
        ]
    },
    {
        "filename": "math_view.py",
        "path": "views/math_view.py",
        "category": "Vista",
        "module_doc": "M\u00f3dulo de Interfaz para An\u00e1lisis Matem\u00e1tico.\n\nEste archivo define la capa de presentaci\u00f3n para la herramienta de \u00e1lgebra. Gestiona la\nentrada de expresiones del usuario, renderiza resultados en formato LaTeX y visualiza\ngr\u00e1ficamente la traza del Aut\u00f3mata de Pila mediante diagramas de Graphviz, permitiendo\nal usuario observar el cambio de estados y el contenido de la pila en tiempo real.",
        "classes": [
            {
                "name": "MathView",
                "doc": "Vista para el an\u00e1lisis matem\u00e1tico y el PDA con navegaci\u00f3n por botones.",
                "methods": [
                    {
                        "name": "__init__",
                        "doc": "Inicializa motores y asegura el estado de la sesi\u00f3n.",
                        "code": "    def __init__(self):\n        \"\"\"Inicializa motores y asegura el estado de la sesi\u00f3n.\"\"\"\n        self.automata = MathAutomata()\n        self.engine = MathEngine()\n        if 'math_step' not in st.session_state:\n            st.session_state.math_step = 0"
                    },
                    {
                        "name": "generate_graphviz",
                        "doc": "Genera el grafo del PDA resaltando el estado actual.",
                        "code": "    def generate_graphviz(self, current_state=None):\n        \"\"\"Genera el grafo del PDA resaltando el estado actual.\"\"\"\n        dot = 'digraph G {\\n  rankdir=LR;\\n  node [fontname=\"Segoe UI\", style=filled, fillcolor=white];\\n'\n        for s in self.automata.transitions.keys():\n            attrs = []\n            if s == current_state: attrs.extend(['fillcolor=\"#ffe0b2\"', 'color=\"#fb8c00\"', 'penwidth=3'])\n            if s in self.automata.estados_aceptacion: attrs.append('shape=doublecircle')\n            if s == \"q_error\": attrs.extend(['color=red', 'fontcolor=red'])\n            dot += f'  {s} [{\", \".join(attrs)}];\\n'\n        for src, trans in self.automata.transitions.items():\n            dest_map = {}\n            for label, dest in trans.items():\n                dest_map.setdefault(dest, []).append(label)\n            for dest, labels in dest_map.items():\n                dot += f'  {src} -> {dest} [label=\"{\", \".join(labels)}\"];\\n'\n        return dot + '}'"
                    },
                    {
                        "name": "show",
                        "doc": "Renderiza la UI de matem\u00e1ticas con navegaci\u00f3n por botones.",
                        "code": "    def show(self):\n        \"\"\"Renderiza la UI de matem\u00e1ticas con navegaci\u00f3n por botones.\"\"\"\n        col_main, col_side = st.columns([1.5, 1])\n        \n        with col_main:\n            st.header(\"\ud83d\udcdd Entrada Algebraica\")\n            user_expr = st.text_input(\"Ingresa la expresi\u00f3n:\", value=\"(a+b)^2\", key=\"m_ui\")\n            \n            if user_expr:\n                is_valid, history = self.automata.validate(user_expr)\n                \n                # Reiniciar \u00edndice si la expresi\u00f3n cambia\n                if \"last_math_expr\" not in st.session_state or st.session_state.last_math_expr != user_expr:\n                    st.session_state.math_step = len(history) - 1\n                    st.session_state.last_math_expr = user_expr\n\n                if is_valid:\n                    st.success(\"\u2705 Estructura v\u00e1lida.\")\n                    opc = st.radio(\"Operaci\u00f3n:\", [\"Simplificaci\u00f3n\", \"Evaluaci\u00f3n\", \"Resoluci\u00f3n\", \"Ver Tuplas\"], horizontal=True)\n                    \n                    if opc == \"Simplificaci\u00f3n\":\n                        res = self.engine.solve_symbolic(user_expr, mode=\"reduce\")\n                        st.latex(sp.latex(res) if not isinstance(res, str) else res)\n                    elif opc == \"Evaluaci\u00f3n\":\n                        vars_needed = sorted(list(set(re.findall(r'[a-zA-Z][a-zA-Z0-9]*', user_expr))))\n                        user_vals = {v: st.number_input(f\"{v}:\", value=1.0) for v in vars_needed}\n                        res = self.engine.solve_symbolic(user_expr, mode=\"evaluate\", var_values=user_vals)\n                        st.metric(\"Resultado\", str(res))\n                    \n                    elif opc == \"Resoluci\u00f3n\":\n                        if \"=\" in user_expr:\n                            res = self.engine.solve_symbolic(user_expr, mode=\"solve\")\n                            \n                            # Si el resultado es una cadena de error o aviso\n                            if \"Error\" in res or \"No se encontraron\" in res:\n                                st.warning(res)\n                            else:\n                                st.subheader(\"Soluciones halladas:\")\n                                # Mostramos el resultado en formato matem\u00e1tico (LaTeX)\n                                # Usamos f-string para envolver el resultado en formato de conjunto o igualdad\n                                st.latex(res)\n                                st.info(\"Las soluciones se presentan en formato matem\u00e1tico est\u00e1ndar.\")\n                        else:\n                            st.warning(\"Ingrese una igualdad (ej: x^2 = 4) para poder resolver.\")\n\n                    elif opc == \"Ver Tuplas\":\n                        tokens = self.automata.process_to_tuples(user_expr)\n                        st.table(pd.DataFrame(tokens, columns=[\"Categor\u00eda\", \"Lexema\"]))\n                else:\n                    st.error(\"\u274c Error de sintaxis.\")\n\n        with col_side:\n            st.header(\"\u2699\ufe0f Traza del PDA\")\n            if user_expr and 'history' in locals():\n                # Controles de navegaci\u00f3n\n                max_step = len(history) - 1\n                c1, c2, c3 = st.columns([1, 2, 1])\n                \n                if c1.button(\"\u2b05\ufe0f\", key=\"math_prev\") and st.session_state.math_step > 0:\n                    st.session_state.math_step -= 1\n                \n                c2.markdown(f\"<center>Paso <b>{st.session_state.math_step}</b> de {max_step}</center>\", unsafe_allow_html=True)\n                \n                if c3.button(\"\u27a1\ufe0f\", key=\"math_next\") and st.session_state.math_step < max_step:\n                    st.session_state.math_step += 1\n\n                current_step_data = history[st.session_state.math_step]\n                st.graphviz_chart(self.generate_graphviz(current_step_data[\"Estado\"]))\n                st.code(f\"Car\u00e1cter: {current_step_data['Car\u00e1cter']}\\nEstado: {current_step_data['Estado']}\\nPila: {current_step_data['Pila']}\")"
                    }
                ],
                "attributes": [
                    "automata",
                    "engine"
                ]
            }
        ]
    },
    {
        "filename": "regex_view.py",
        "path": "views/regex_view.py",
        "category": "Vista",
        "module_doc": "M\u00f3dulo de Interfaz para Visualizaci\u00f3n de AFN.\n\nEncargado de la representaci\u00f3n visual del procesamiento de lenguajes regulares.\nImplementa una interfaz interactiva que permite generar aut\u00f3matas a partir de Regex,\nsimular la evaluaci\u00f3n de cadenas paso a paso y visualizar din\u00e1micamente los estados\nactivos y finales del AFN mediante el uso de grafos dirigidos y controles de navegaci\u00f3n.",
        "classes": [
            {
                "name": "RegexView",
                "doc": "Visualizaci\u00f3n del AFN con navegaci\u00f3n por pasos mediante botones.",
                "methods": [
                    {
                        "name": "__init__",
                        "doc": "Inicializa el motor y el estado de la sesi\u00f3n.",
                        "code": "    def __init__(self):\n        \"\"\"Inicializa el motor y el estado de la sesi\u00f3n.\"\"\"\n        self.engine = RegexEngine()\n        if 'reg_step' not in st.session_state:\n            st.session_state.reg_step = 0"
                    },
                    {
                        "name": "generate_afn_dot",
                        "doc": "Genera el c\u00f3digo DOT resaltando los nodos activos.",
                        "code": "    def generate_afn_dot(self, start_node, accept_node, active_nodes=None):\n        \"\"\"Genera el c\u00f3digo DOT resaltando los nodos activos.\"\"\"\n        if active_nodes is None: active_nodes = set()\n        active_ids = {n.id for n in active_nodes}\n        \n        dot = 'digraph AFN {\\n  rankdir=LR;\\n  node [shape=circle, fontname=\"Arial\", style=filled, fillcolor=white];\\n'\n        visited = set()\n        queue = [start_node]\n        \n        accept_attr = 'shape=doublecircle, color=green'\n        if accept_node.id in active_ids:\n            accept_attr += ', fillcolor=\"#ffe0b2\", color=\"#fb8c00\", penwidth=3'\n        dot += f'  {accept_node.name} [{accept_attr}];\\n'\n        \n        dot += f'  secret_init [style=invis];\\n  secret_init -> {start_node.name};\\n'\n\n        while queue:\n            curr = queue.pop(0)\n            if curr.id in visited: continue\n            visited.add(curr.id)\n            \n            if curr.id in active_ids and curr.id != accept_node.id:\n                dot += f'  {curr.name} [fillcolor=\"#ffe0b2\", color=\"#fb8c00\", penwidth=3];\\n'\n            \n            for next_node in curr.epsilon_transitions:\n                dot += f'  {curr.name} -> {next_node.name} [label=\"&epsilon;\", color=gray, fontcolor=gray];\\n'\n                queue.append(next_node)\n                \n            for char, nodes in curr.transitions.items():\n                for next_node in nodes:\n                    dot += f'  {curr.name} -> {next_node.name} [label=\"{char}\"];\\n'\n                    queue.append(next_node)\n        return dot + '}'"
                    },
                    {
                        "name": "show",
                        "doc": "Muestra la interfaz de Regex con navegaci\u00f3n por botones.",
                        "code": "    def show(self):\n        \"\"\"Muestra la interfaz de Regex con navegaci\u00f3n por botones.\"\"\"\n        st.header(\"\ud83e\uddec Generador y Traza de AFN\")\n        col_input, col_viz = st.columns([1, 1.5])\n        \n        with col_input:\n            st.subheader(\"Configuraci\u00f3n\")\n            regex_input = st.text_input(\"Regex:\", value=\"ab*\", key=\"reg_input\")\n            test_string = st.text_input(\"Cadena:\", value=\"abbb\", key=\"str_input\")\n            \n            st.markdown(\"---\")\n            st.info(\"**S\u00edmbolos:** a|b (Uni\u00f3n), ab (Concat), a* (Kleene), a+ (Positivo)\")\n\n        with col_viz:\n            if regex_input:\n                start_n, end_n = self.engine.parse_regex_to_afn(regex_input)\n                if start_n:\n                    history = self.engine.simulate_afn(start_n, test_string)\n                    max_step = len(history) - 1\n                    \n                    # Reiniciar \u00edndice si cambia la regex o cadena\n                    current_id = regex_input + test_string\n                    if \"last_reg_id\" not in st.session_state or st.session_state.last_reg_id != current_id:\n                        st.session_state.reg_step = max_step\n                        st.session_state.last_reg_id = current_id\n\n                    # Controles de navegaci\u00f3n\n                    c1, c2, c3 = st.columns([1, 2, 1])\n                    if c1.button(\"\u2b05\ufe0f\", key=\"reg_prev\") and st.session_state.reg_step > 0:\n                        st.session_state.reg_step -= 1\n                    \n                    c2.markdown(f\"<center>Paso <b>{st.session_state.reg_step}</b> de {max_step}</center>\", unsafe_allow_html=True)\n                    \n                    if c3.button(\"\u27a1\ufe0f\", key=\"reg_next\") and st.session_state.reg_step < max_step:\n                        st.session_state.reg_step += 1\n\n                    current_data = history[st.session_state.reg_step]\n                    dot_code = self.generate_afn_dot(start_n, end_n, current_data[\"Estados\"])\n                    st.graphviz_chart(dot_code)\n                    \n                    names = sorted([n.name for n in current_data[\"Estados\"]])\n                    st.code(f\"Leyendo: '{current_data['Car\u00e1cter']}'\\nEstados activos: {', '.join(names)}\")\n\n                    if any(n.id == end_n.id for n in history[-1][\"Estados\"]):\n                        st.success(\"\u2714\ufe0f Cadena ACEPTADA\")\n                    else:\n                        st.warning(\"\u274c Cadena RECHAZADA\")"
                    }
                ],
                "attributes": [
                    "engine"
                ]
            }
        ]
    },
    {
        "filename": "stack_interpreter_view.py",
        "path": "views/stack_interpreter_view.py",
        "category": "Vista",
        "module_doc": "M\u00f3dulo de Interfaz para el Int\u00e9rprete Basado en Pila.\n\nDefine la capa de presentaci\u00f3n del int\u00e9rprete de lenguaje simple.\nGestiona la entrada de c\u00f3digo fuente, orquesta la compilaci\u00f3n y\nejecuci\u00f3n, y renderiza la traza paso a paso de forma visual e\ninteractiva mediante Streamlit: pila animada, memoria de variables,\nc\u00f3digo intermedio generado y navegaci\u00f3n por botones.",
        "classes": [
            {
                "name": "StackInterpreterView",
                "doc": "Vista del int\u00e9rprete de pila con navegaci\u00f3n paso a paso.\n\nReutiliza el mismo patr\u00f3n de navegaci\u00f3n por botones (\u2b05\ufe0f / \u27a1\ufe0f)\nque MathView y RegexView, manteniendo consistencia visual.",
                "methods": [
                    {
                        "name": "__init__",
                        "doc": "Inicializa el compilador, el int\u00e9rprete y el estado de sesi\u00f3n.",
                        "code": "    def __init__(self):\n        \"\"\"Inicializa el compilador, el int\u00e9rprete y el estado de sesi\u00f3n.\"\"\"\n        self._compiler    = StackCompiler()\n        self._interpreter = StackInterpreter()\n\n        # Estado de sesi\u00f3n propio del m\u00f3dulo (prefijo 'si_' para no colisionar)\n        defaults = {\n            \"si_steps\":       [],     # lista de ExecutionStep\n            \"si_step_idx\":    0,      # paso actual en la navegaci\u00f3n\n            \"si_bytecode\":    [],     # instrucciones generadas\n            \"si_last_source\": \"\",     # cache para detectar cambios\n            \"si_error\":       None,   # mensaje de error de compilaci\u00f3n\n        }\n        for key, value in defaults.items():\n            if key not in st.session_state:\n                st.session_state[key] = value"
                    },
                    {
                        "name": "show",
                        "doc": "Renderiza la UI completa del int\u00e9rprete.",
                        "code": "    def show(self) -> None:\n        \"\"\"Renderiza la UI completa del int\u00e9rprete.\"\"\"\n        self._render_header()\n\n        col_left, col_right = st.columns([1.1, 1])\n\n        with col_left:\n            self._render_editor()\n\n        with col_right:\n            self._render_trace_panel()"
                    },
                    {
                        "name": "_render_header",
                        "doc": "Encabezado con descripci\u00f3n breve y selector de ejemplos.",
                        "code": "    def _render_header(self) -> None:\n        \"\"\"Encabezado con descripci\u00f3n breve y selector de ejemplos.\"\"\"\n        st.markdown(\n            \"Escribe c\u00f3digo fuente en el editor, comp\u00edlalo y observa \"\n            \"c\u00f3mo el int\u00e9rprete lo ejecuta **instrucci\u00f3n por instrucci\u00f3n** \"\n            \"sobre la pila.\"\n        )\n\n        example_key = st.selectbox(\n            \"Cargar ejemplo:\",\n            options=list(_EXAMPLES.keys()),\n            key=\"si_example_select\",\n        )\n        if st.button(\"\ud83d\udcc2 Cargar ejemplo\", key=\"si_load_example\"):\n            st.session_state[\"si_source_input\"] = _EXAMPLES[example_key]\n            # Reiniciar estado al cargar un ejemplo nuevo\n            self._reset_state()"
                    },
                    {
                        "name": "_render_editor",
                        "doc": "Panel izquierdo: editor de c\u00f3digo + c\u00f3digo intermedio.",
                        "code": "    def _render_editor(self) -> None:\n        \"\"\"Panel izquierdo: editor de c\u00f3digo + c\u00f3digo intermedio.\"\"\"\n        st.subheader(\"\u270f\ufe0f Editor de c\u00f3digo\")\n\n        source = st.text_area(\n            \"C\u00f3digo fuente:\",\n            height=200,\n            key=\"si_source_input\",\n            placeholder=\"x = 5\\ny = x + 3\\n\",\n        )\n\n        col_compile, col_clear = st.columns([2, 1])\n        with col_compile:\n            compile_btn = st.button(\"\u25b6 Compilar y ejecutar\", key=\"si_compile_btn\",\n                                    type=\"primary\")\n        with col_clear:\n            if st.button(\"\ud83d\uddd1 Limpiar\", key=\"si_clear_btn\"):\n                self._reset_state()\n                st.rerun()\n\n        if compile_btn and source.strip():\n            self._compile_and_run(source)\n\n        # Muestra el c\u00f3digo intermedio generado\n        if st.session_state[\"si_error\"]:\n            st.error(f\"\u26a0\ufe0f {st.session_state['si_error']}\")\n\n        elif st.session_state[\"si_bytecode\"]:\n            st.subheader(\"\ud83d\udd22 C\u00f3digo intermedio generado\")\n            self._render_bytecode_table()"
                    },
                    {
                        "name": "_render_trace_panel",
                        "doc": "Panel derecho: navegaci\u00f3n paso a paso, pila y memoria.",
                        "code": "    def _render_trace_panel(self) -> None:\n        \"\"\"Panel derecho: navegaci\u00f3n paso a paso, pila y memoria.\"\"\"\n        steps: list[ExecutionStep] = st.session_state[\"si_steps\"]\n\n        if not steps:\n            st.info(\"\ud83d\udca1 Escribe c\u00f3digo y presiona **Compilar y ejecutar** para ver la traza.\")\n            return\n\n        st.subheader(\"\u2699\ufe0f Traza de ejecuci\u00f3n\")\n\n        # \u2500\u2500 Controles de navegaci\u00f3n \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 #\n        max_idx = len(steps) - 1\n        idx     = st.session_state[\"si_step_idx\"]\n\n        nav_l, nav_info, nav_r = st.columns([1, 3, 1])\n\n        if nav_l.button(\"\u2b05\ufe0f\", key=\"si_prev\") and idx > 0:\n            st.session_state[\"si_step_idx\"] -= 1\n            idx -= 1\n\n        if nav_r.button(\"\u27a1\ufe0f\", key=\"si_next\") and idx < max_idx:\n            st.session_state[\"si_step_idx\"] += 1\n            idx += 1\n\n        nav_info.markdown(\n            f\"<div style='text-align:center;padding-top:8px'>\"\n            f\"Paso <b>{idx + 1}</b> de <b>{max_idx + 1}</b>\"\n            f\"</div>\",\n            unsafe_allow_html=True,\n        )\n\n        current: ExecutionStep = steps[idx]\n\n        # \u2500\u2500 Instrucci\u00f3n actual \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 #\n        instr_color = \"#ffcccc\" if current.error else \"#d4edda\"\n        st.markdown(\n            f\"<div style='background:{instr_color};padding:10px;\"\n            f\"border-radius:8px;font-family:monospace;font-size:15px'>\"\n            f\"<b>Instrucci\u00f3n:</b>  {current.instruction}\"\n            f\"</div>\",\n            unsafe_allow_html=True,\n        )\n\n        # \u2500\u2500 Descripci\u00f3n en lenguaje natural \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 #\n        st.caption(current.describe())\n\n        if current.error:\n            st.error(f\"Error en ejecuci\u00f3n: {current.error}\")\n            return\n\n        # \u2500\u2500 Visualizaci\u00f3n de la pila \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 #\n        st.markdown(\"**\ud83e\udd5e Estado de la pila** *(tope arriba)*\")\n        self._render_stack_visual(current.stack_snapshot)\n\n        # \u2500\u2500 Memoria de variables \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 #\n        st.markdown(\"**\ud83d\uddc4\ufe0f Memoria de variables**\")\n        self._render_memory_table(current.memory_snapshot)"
                    },
                    {
                        "name": "_render_bytecode_table",
                        "doc": "Tabla del c\u00f3digo intermedio con el paso actual resaltado.",
                        "code": "    def _render_bytecode_table(self) -> None:\n        \"\"\"Tabla del c\u00f3digo intermedio con el paso actual resaltado.\"\"\"\n        bytecode = st.session_state[\"si_bytecode\"]\n        idx      = st.session_state[\"si_step_idx\"]\n        steps    = st.session_state[\"si_steps\"]\n\n        # \u00cdndice de la instrucci\u00f3n actual en el bytecode\n        current_instr_idx = steps[idx].step_num if steps else -1\n\n        rows = []\n        for i, instr in enumerate(bytecode):\n            marker = \"\u25b6\" if i == current_instr_idx else \"\"\n            rows.append({\n                \" \": marker,\n                \"#\": i,\n                \"Opcode\":   instr.opcode.name,\n                \"Operando\": str(instr.operand) if instr.operand is not None else \"\",\n            })\n\n        df = pd.DataFrame(rows)\n        st.dataframe(df, use_container_width=True, hide_index=True, height=220)"
                    },
                    {
                        "name": "_render_stack_visual",
                        "doc": "Renderiza la pila como celdas apiladas (tope arriba).",
                        "code": "    def _render_stack_visual(self, snapshot: list) -> None:\n        \"\"\"Renderiza la pila como celdas apiladas (tope arriba).\"\"\"\n        if not snapshot:\n            st.markdown(\n                \"<div style='text-align:center;color:gray;font-style:italic;\"\n                \"padding:16px;border:1px dashed #ccc;border-radius:8px'>\"\n                \"Pila vac\u00eda\"\n                \"</div>\",\n                unsafe_allow_html=True,\n            )\n            return\n\n        # Renderizamos de arriba (tope) hacia abajo (fondo)\n        reversed_snap = list(reversed(snapshot))\n        html_cells = \"\"\n        for i, val in enumerate(reversed_snap):\n            is_top     = (i == 0)\n            bg_color   = \"#1a7a4a\" if is_top else \"#2e9c6a\"\n            text_color = \"#ffffff\"\n            border     = \"3px solid #0d5c37\" if is_top else \"1px solid #1a7a4a\"\n            label      = \" \u2190 tope\" if is_top else \"\"\n            html_cells += (\n                f\"<div style='background:{bg_color};color:{text_color};\"\n                f\"border:{border};padding:8px 16px;margin:2px 0;\"\n                f\"border-radius:6px;font-family:monospace;font-size:14px;\"\n                f\"display:flex;justify-content:space-between'>\"\n                f\"<span>{val}</span>\"\n                f\"<span style='opacity:0.7;font-size:12px'>{label}</span>\"\n                f\"</div>\"\n            )\n\n        st.markdown(\n            f\"<div style='border:1px solid #ccc;border-radius:8px;\"\n            f\"padding:8px;max-height:200px;overflow-y:auto'>{html_cells}</div>\",\n            unsafe_allow_html=True,\n        )"
                    },
                    {
                        "name": "_render_memory_table",
                        "doc": "Tabla de variables con nombre y valor actual.",
                        "code": "    def _render_memory_table(self, memory: dict) -> None:\n        \"\"\"Tabla de variables con nombre y valor actual.\"\"\"\n        if not memory:\n            st.caption(\"Sin variables definidas a\u00fan.\")\n            return\n\n        df = pd.DataFrame(\n            [{\"Variable\": k, \"Valor\": v} for k, v in memory.items()]\n        )\n        st.dataframe(df, use_container_width=True, hide_index=True)"
                    },
                    {
                        "name": "_compile_and_run",
                        "doc": "Compila el fuente, ejecuta el int\u00e9rprete y guarda la traza.",
                        "code": "    def _compile_and_run(self, source: str) -> None:\n        \"\"\"Compila el fuente, ejecuta el int\u00e9rprete y guarda la traza.\"\"\"\n        self._reset_state()\n\n        try:\n            bytecode = self._compiler.compile(source)\n            st.session_state[\"si_bytecode\"] = bytecode\n        except (LexerError, CompilerError) as exc:\n            st.session_state[\"si_error\"] = str(exc)\n            return\n\n        steps = self._interpreter.run(bytecode)\n        st.session_state[\"si_steps\"]       = steps\n        st.session_state[\"si_last_source\"] = source"
                    },
                    {
                        "name": "_reset_state",
                        "doc": "Reinicia el estado de ejecuci\u00f3n sin tocar el editor.",
                        "code": "    def _reset_state(self) -> None:\n        \"\"\"Reinicia el estado de ejecuci\u00f3n sin tocar el editor.\"\"\"\n        st.session_state[\"si_steps\"]    = []\n        st.session_state[\"si_step_idx\"] = 0\n        st.session_state[\"si_bytecode\"] = []\n        st.session_state[\"si_error\"]    = None"
                    }
                ],
                "attributes": [
                    "_compiler",
                    "_interpreter"
                ]
            }
        ]
    }
];