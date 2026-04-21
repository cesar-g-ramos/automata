const projectData = [
    {
        "filename": "main.py",
        "path": "main.py",
        "category": "Orquestador",
        "module_doc": "M\u00f3dulo Orquestador - Interfaz de Usuario y Control de Flujo.\n\nEste archivo act\u00faa como el punto de entrada principal (Main Entry Point) utilizando el framework Streamlit.\nSe encarga de inicializar la configuraci\u00f3n de la p\u00e1gina, gestionar el estado de la sesi\u00f3n y\ncoordinar la navegaci\u00f3n entre las vistas de An\u00e1lisis Matem\u00e1tico y Lenguajes Regulares.\nImplementa el patr\u00f3n de dise\u00f1o Singleton para el manejo de la aplicaci\u00f3n.",
        "classes": [
            {
                "name": "CompilerApp",
                "doc": "Orquestador principal de la aplicaci\u00f3n.",
                "methods": [
                    {
                        "name": "__init__",
                        "doc": "Configuraci\u00f3n de p\u00e1gina y vistas.",
                        "code": "    def __init__(self):\n        \"\"\"Configuraci\u00f3n de p\u00e1gina y vistas.\"\"\"\n        st.set_page_config(page_title=\"Compiladores Lab Pro\", layout=\"wide\")\n        self.math_view = MathView()\n        self.regex_view = RegexView()"
                    },
                    {
                        "name": "show_sidebar",
                        "doc": "Muestra las notas acad\u00e9micas.",
                        "code": "    def show_sidebar(self):\n        \"\"\"Muestra las notas acad\u00e9micas.\"\"\"\n        st.sidebar.markdown(\"### Notas Acad\u00e9micas\")\n        st.sidebar.write(\"\"\"\n        El **Algoritmo de Thompson** construye AFNs agregando estados auxiliares.\n        - Flechas grises (&epsilon;): Transiciones espont\u00e1neas.\n        - C\u00edrculo doble verde: Estado final.\n        - **Naranja:** Estados actuales.\n        \"\"\")"
                    },
                    {
                        "name": "run",
                        "doc": "Loop principal.",
                        "code": "    def run(self):\n        \"\"\"Loop principal.\"\"\"\n        st.title(\"\ud83c\udf93 Laboratorio de Teor\u00eda de Compiladores\")\n        self.show_sidebar()\n        \n        tabs = st.tabs([\"\ud83e\uddee An\u00e1lisis Matem\u00e1tico\", \"\ud83d\udd0d Lenguajes Regulares\"])\n        with tabs[0]: self.math_view.show()\n        with tabs[1]: self.regex_view.show()"
                    }
                ],
                "attributes": [
                    "math_view",
                    "regex_view"
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
    }
];