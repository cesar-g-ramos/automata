"""
Módulo de Autómata de Pila (PDA) para Validación Algebraica.

Este archivo implementa la lógica de un Autómata de Pila encargado de validar la estructura 
sintáctica de expresiones algebraicas. Se encarga de la clasificación de caracteres (tokens), 
el manejo de transiciones entre estados y el control de agrupadores mediante una pila lógica, 
garantizando que la expresión sea matemáticamente válida antes de su procesamiento.
"""

import re

class MathAutomata:
    """Implementación del Autómata de Pila para sintaxis algebraica."""

    def __init__(self):
        """Define estados y transiciones."""
        self.transitions = {
            "q_init": {"signo": "q_num", "digito": "q_num", "letra": "q_var", "par_abierto": "q_init"},
            "q_num": {"digito": "q_num", "punto": "q_num", "letra": "q_var", "operador": "q_init", 
                      "par_abierto": "q_init", "par_cerrado": "q_num", "igual": "q_init"},
            "q_var": {"letra": "q_var", "digito": "q_var", "operador": "q_init", 
                      "par_abierto": "q_init", "par_cerrado": "q_num", "igual": "q_init"},
            "q_error": {}
        }
        self.estado_inicial = "q_init"
        self.estados_aceptacion = ["q_num", "q_var"]

    def get_char_type(self, char):
        """Retorna el tipo de carácter."""
        if char.isdigit(): return "digito"
        if char.isalpha(): return "letra"
        if char in "+-*/^": return "operador"
        if char == "(": return "par_abierto"
        if char == ")": return "par_cerrado"
        if char == ".": return "punto"
        if char == "=": return "igual"
        if char in "+-": return "signo"
        return "desconocido"

    def process_to_tuples(self, expression):
        """Análisis léxico en tuplas."""
        items = re.findall(r'[0-9.]+|[a-zA-Z][a-zA-Z0-9]*|[\+\-\*/\^=\(\)]', expression)
        tokens = []
        for item in items:
            t_type = "OPERADOR"
            if item.replace('.', '', 1).isdigit(): t_type = "NUMERO"
            elif item.isalpha() or (item[0].isalpha() and item.isalnum()): t_type = "VARIABLE"
            elif item in "()": t_type = "AGRUPADOR"
            elif item == "=": t_type = "IGUALDAD"
            tokens.append((t_type, item))
        return tokens

    def validate(self, expression):
        """Valida la cadena y devuelve historial."""
        current_state = self.estado_inicial
        history = [{"Carácter": "Inicio", "Tipo": "-", "Estado": current_state, "Pila": "[]"}]
        stack = []
        clean_expr = expression.replace(" ", "")
        for char in clean_expr:
            char_type = self.get_char_type(char)
            if char_type == "par_abierto": stack.append("(")
            elif char_type == "par_cerrado":
                if not stack: current_state = "q_error"
                else: stack.pop()
            if char_type in "+-" and current_state == "q_init": char_type = "signo"
            if current_state != "q_error":
                current_state = self.transitions.get(current_state, {}).get(char_type, "q_error")
            history.append({"Carácter": char, "Tipo": char_type, "Estado": current_state, "Pila": str(list(stack))})
            if current_state == "q_error": break
        return (current_state in self.estados_aceptacion and len(stack) == 0), history