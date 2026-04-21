"""
Módulo de Introspección y Generación de Metadatos.

Este script actúa como un 'parser' de código fuente que utiliza el Abstract Syntax Tree (AST)
para mapear la arquitectura completa del proyecto. Genera un manifiesto JSON (data.js) 
que incluye la jerarquía de archivos, diagramas de clases implícitos y la lógica 
de implementación de cada componente.
"""

import ast
import json
import os

def clean_docstring(doc):
    if not doc: return "Sin descripción técnica disponible."
    lines = doc.expandtabs().splitlines()
    margin = 2**31 - 1
    for line in lines[1:]:
        content = len(line) - len(line.lstrip())
        if line.lstrip(): margin = min(margin, content)
    trimmed = [lines[0].strip()]
    if len(lines) > 1:
        for line in lines[1:]: trimmed.append(line[margin:].rstrip())
    return "\n".join(trimmed).replace("Args:", "\n**Argumentos:**").replace("Returns:", "\n**Retorna:**").strip()

def extract_docs(file_path, category):
    if not os.path.exists(file_path): return None
    with open(file_path, "r", encoding="utf-8") as f:
        source = f.read()
        tree = ast.parse(source)

    module_info = {
        "filename": os.path.basename(file_path),
        "path": file_path,
        "category": category,
        "module_doc": clean_docstring(ast.get_docstring(tree)),
        "classes": []
    }

    for node in tree.body:
        if isinstance(node, ast.ClassDef):
            class_info = {
                "name": node.name,
                "doc": clean_docstring(ast.get_docstring(node)),
                "methods": [],
                "attributes": []
            }
            # Intentar extraer atributos del __init__
            for item in node.body:
                if isinstance(item, ast.FunctionDef):
                    if item.name == "__init__":
                        for stmt in item.body:
                            if isinstance(stmt, ast.Assign):
                                for target in stmt.targets:
                                    if isinstance(target, ast.Attribute):
                                        class_info["attributes"].append(target.attr)
                    
                    start = item.lineno - 1
                    end = item.end_lineno
                    class_info["methods"].append({
                        "name": item.name,
                        "doc": clean_docstring(ast.get_docstring(item)),
                        "code": "\n".join(source.splitlines()[start:end])
                    })
            module_info["classes"].append(class_info)
    return module_info

def main():
    config = [
        ("main.py", "Orquestador"),
        ("models/math_automata.py", "Modelo"),
        ("models/math_engine.py", "Modelo"),
        ("models/regex_engine.py", "Modelo"),
        ("models/regex_node.py", "Modelo"),
        ("models/thompson_builder.py", "Modelo"),
        ("views/math_view.py", "Vista"),
        ("views/regex_view.py", "Vista")
    ]
    all_data = [extract_docs(p, c) for p, c in config if extract_docs(p, c)]
    with open("data.js", "w", encoding="utf-8") as out:
        out.write(f"const projectData = {json.dumps(all_data, indent=4)};")
    print("🚀 data.js generado con éxito.")

if __name__ == "__main__":
    main()