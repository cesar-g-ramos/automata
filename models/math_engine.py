import sympy as sp
import re

class MathEngine:
    """Motor de cálculo simbólico utilizando SymPy."""

    def prepare_for_sympy(self, expr):
        """Ajusta la cadena para ser procesada por SymPy.

        Args:
            expr (str): Expresión ingresada por el usuario.

        Returns:
            str: Expresión formateada para SymPy.
        """
        processed = expr.replace("^", "**")
        processed = re.sub(r'(\d)([a-zA-Z])', r'\1*\2', processed)
        processed = re.sub(r'([a-zA-Z])([a-zA-Z])', r'\1*\2', processed)
        processed = re.sub(r'(\))(\()', r'\1*\2', processed)
        processed = re.sub(r'(\d)(\()', r'\1*\2', processed)
        return processed

    def _format_solutions(self, solutions):
        """Convierte el objeto de solución de SymPy en un formato amigable.

        Args:
            solutions: Objeto devuelto por sp.solve (lista, dict, etc).

        Returns:
            str: Representación legible de las soluciones.
        """
        if not solutions:
            return "No se encontraron soluciones reales."
        
        # Caso de sistemas de ecuaciones (Diccionario)
        if isinstance(solutions, dict):
            parts = [f"{sp.latex(var)} = {sp.latex(val)}" for var, val in solutions.items()]
            return ", ".join(parts)
        
        # Caso de lista de soluciones (Ecuación de una variable)
        if isinstance(solutions, list):
            # Si la lista contiene diccionarios (sistemas complejos)
            if solutions and isinstance(solutions[0], dict):
                all_sols = []
                for sol in solutions:
                    parts = [f"{sp.latex(k)} = {sp.latex(v)}" for k, v in sol.items()]
                    all_sols.append(f"({', '.join(parts)})")
                return " ó ".join(all_sols)
            
            # Si es una lista de valores simples [x1, x2]
            formatted_values = [sp.latex(s) for s in solutions]
            return " , ".join(formatted_values)

        return str(solutions)

    def solve_symbolic(self, expr, mode="reduce", var_values=None):
        """Resuelve la expresión según el modo solicitado.

        Args:
            expr (str): Expresión matemática.
            mode (str): Modo ('reduce', 'evaluate', 'solve').
            var_values (dict): Valores para sustitución.

        Returns:
            Any: Resultado procesado (cadena formateada o valor numérico).
        """
        try:
            p_expr = self.prepare_for_sympy(expr)
            if mode == "reduce":
                if "=" in p_expr:
                    l, r = p_expr.split("=")
                    return f"{sp.expand(l)} = {sp.expand(r)}"
                return sp.expand(p_expr)
            
            elif mode == "evaluate":
                target = p_expr.split("=")[0] if "=" in p_expr else p_expr
                s_expr = sp.sympify(target)
                return s_expr.subs(var_values) if var_values else s_expr.evalf()
            
            elif mode == "solve":
                if "=" in p_expr:
                    left, right = p_expr.split("=")
                    equation = sp.Eq(sp.sympify(left), sp.sympify(right))
                    raw_solutions = sp.solve(equation)
                    return self._format_solutions(raw_solutions)
                return "No es una ecuación."
        except Exception as e:
            return f"Error: {e}"