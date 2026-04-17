class RegexNode:
    """Representa un estado en el autómata de Thompson.

    Attributes:
        id (int): Identificador único del nodo.
        name (str): Nombre del estado (s0, s1, etc.).
        transitions (dict): Diccionario de transiciones por carácter.
        epsilon_transitions (list): Lista de nodos alcanzables por épsilon.
    """

    def __init__(self, node_id):
        """Inicializa el nodo con un ID."""
        self.id = node_id
        self.name = f"s{node_id}"
        self.transitions = {}  
        self.epsilon_transitions = [] 

    def add_transition(self, char, node):
        """Agrega una transición por carácter."""
        if char not in self.transitions:
            self.transitions[char] = []
        self.transitions[char].append(node)

    def add_epsilon(self, node):
        """Agrega una transición épsilon."""
        self.epsilon_transitions.append(node)