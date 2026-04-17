from models.thompson_builder import ThompsonBuilder

class RegexEngine:
    """Orquestador para el procesamiento de expresiones regulares."""

    def __init__(self):
        """Inicializa el motor con el constructor de Thompson."""
        self.builder = ThompsonBuilder()

    def get_epsilon_closure(self, nodes):
        """Calcula la clausura épsilon de un conjunto de estados."""
        closure = set(nodes)
        stack = list(nodes)
        while stack:
            node = stack.pop()
            for eps_node in node.epsilon_transitions:
                if eps_node not in closure:
                    closure.add(eps_node)
                    stack.append(eps_node)
        return closure

    def parse_regex_to_afn(self, regex):
        """Parser que convierte la regex en una estructura AFN."""
        stack = []
        i = 0
        while i < len(regex):
            char = regex[i]
            if char.isalnum():
                stack.append(self.builder.build_basic(char))
            elif char == '*':
                if stack:
                    s, e = stack.pop()
                    stack.append(self.builder.build_kleene(s, e))
            elif char == '+':
                if stack:
                    s, e = stack.pop()
                    stack.append(self.builder.build_positive(s, e))
            elif char == '|':
                if i + 1 < len(regex) and stack:
                    s1, e1 = stack.pop()
                    char2 = regex[i+1]
                    s2, e2 = self.builder.build_basic(char2)
                    stack.append(self.builder.build_union(s1, e1, s2, e2))
                    i += 1 
            i += 1
        
        if not stack: return None, None
        res_s, res_e = stack[0]
        for next_s, next_e in stack[1:]:
            res_s, res_e = self.builder.build_concat(res_s, res_e, next_s, next_e)
        return res_s, res_e

    def simulate_afn(self, start_node, chain):
        """Simula el AFN devolviendo el historial de estados activos."""
        current_states = self.get_epsilon_closure([start_node])
        history = [{"Carácter": "Inicio", "Estados": current_states}]
        
        for char in chain:
            next_states = set()
            for node in current_states:
                if char in node.transitions:
                    for target in node.transitions[char]:
                        next_states.add(target)
            current_states = self.get_epsilon_closure(next_states)
            history.append({"Carácter": char, "Estados": current_states})
            if not current_states: break
        return history