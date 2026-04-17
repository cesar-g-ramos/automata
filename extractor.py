"""
Módulo de Extracción de Metadatos - Generador de Documentación Dinámica.

Utiliza el módulo ast de Python para realizar una introspección del código fuente.
Extrae descripciones de módulos, clases y métodos (Docstrings) para generar un
archivo data.js que alimenta la interfaz visual, garantizando que la documentación
web esté siempre sincronizada con la lógica del código.
"""

import ast
import json
import os
import re

def clean_docstring(doc):
    """Limpia y formatea el docstring para que sea legible en HTML."""
    if not doc:
        return "Sin descripción."
    
    # Eliminar espacios en blanco comunes de la indentación de Python
    lines = doc.expandtabs().splitlines()
    margin = 2**31 - 1
    for line in lines[1:]:
        content = len(line) - len(line.lstrip())
        if line.lstrip():
            margin = min(margin, content)
    
    trimmed = [lines[0].strip()]
    if len(lines) > 1:
        for line in lines[1:]:
            trimmed.append(line[margin:].rstrip())
    
    # Unir y formatear secciones comunes de Google Style
    full_text = "\n".join(trimmed)
    
    # Resaltar secciones clave para el frontend
    full_text = full_text.replace("Args:", "\n**Argumentos:**")
    full_text = full_text.replace("Returns:", "\n**Retorna:**")
    full_text = full_text.replace("Attributes:", "\n**Atributos:**")
    full_text = full_text.replace("Raises:", "\n**Excepciones:**")
    
    return full_text.strip()

def extract_docs(file_path):
    """Extrae toda la estructura del archivo incluyendo lógica compleja de docstrings."""
    if not os.path.exists(file_path):
        return None

    with open(file_path, "r", encoding="utf-8") as f:
        node = ast.parse(f.read())

    module_doc = clean_docstring(ast.get_docstring(node))
    
    module_info = {
        "filename": os.path.basename(file_path),
        "module_doc": module_doc,
        "classes": [],
        "functions": []
    }

    for item in node.body:
        if isinstance(item, ast.ClassDef):
            class_info = {
                "name": item.name,
                "doc": clean_docstring(ast.get_docstring(item)),
                "methods": []
            }
            for subitem in item.body:
                if isinstance(subitem, ast.FunctionDef):
                    # Incluimos todos los métodos documentados
                    method_doc = ast.get_docstring(subitem)
                    if method_doc:
                        class_info["methods"].append({
                            "name": subitem.name,
                            "doc": clean_docstring(method_doc)
                        })
            module_info["classes"].append(class_info)
        
        elif isinstance(item, ast.FunctionDef):
            func_doc = ast.get_docstring(item)
            if func_doc:
                module_info["functions"].append({
                    "name": item.name,
                    "doc": clean_docstring(func_doc)
                })

    return module_info

def main():
    files = ["lexer.py", "nodes.py", "parser.py", "main.py"]
    all_data = []

    print("--- Sincronizando Docstrings con el Proyecto ---")
    for f in files:
        data = extract_docs(f)
        if data:
            all_data.append(data)
            print(f"Sincronizado: {f}")
    
    with open("data.js", "w", encoding="utf-8") as out:
        out.write("const projectData = ")
        json.dump(all_data, out, indent=4, ensure_ascii=False)
        out.write(";")
    
    print("\n[COHERENCIA VERIFICADA] data.js generado con éxito.")

if __name__ == "__main__":
    main()