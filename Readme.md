
---

# 🎓 Compiler Lab Pro: Simulador de Autómatas y Lenguajes

![Python](https://img.shields.io/badge/python-3.9+-blue.svg?style=for-the-badge&logo=python&logoColor=white)
![Streamlit](https://img.shields.io/badge/Streamlit-FF4B4B?style=for-the-badge&logo=Streamlit&logoColor=white)
![SymPy](https://img.shields.io/badge/SymPy-3B5526?style=for-the-badge&logo=python&logoColor=white)
![Status](https://img.shields.io/badge/Status-Interactive-success?style=for-the-badge)

¡Bienvenido al **Laboratorio de Teoría de Compiladores**! Una herramienta integral diseñada para visualizar, simular y analizar los conceptos fundamentales de los lenguajes formales y el cálculo simbólico.


> [!TIP]
> Este proyecto no solo es una aplicación; incluye un **motor de introspección** que genera su propia documentación técnica interactiva.


---

## 🚀 Características Principales

### 1. 🧮 Análisis Matemático y Autómatas de Pila (PDA)
*   **Validación Sintáctica:** Un autómata de pila real que valida expresiones algebraicas paso a paso.
*   **Motor Simbólico:** Integración con SymPy para simplificar, evaluar y resolver ecuaciones complejas.
*   **Traza Visual:** Visualización en tiempo real del cambio de estados y el contenido de la **pila** mediante grafos de Graphviz.

### 2. 🧬 Lenguajes Regulares y Algoritmo de Thompson
*   **Regex a AFN:** Convierte expresiones regulares (`a|b`, `ab*`, `(a+b)*`) en Autómatas Finitos No Deterministas.
*   **Simulación de Cadenas:** Prueba cadenas sobre el autómata generado y observa cómo se calculan las **clausuras épsilon** y los estados activos.
*   **Navegación por Pasos:** Controles interactivos para retroceder o avanzar en la lectura de la cadena.

---

## 🚀 Características Principales

### 1. 🧮 Análisis Matemático y Autómatas de Pila (PDA)
*   **Validación Sintáctica:** Un autómata de pila real que valida expresiones algebraicas paso a paso.
*   **Motor Simbólico:** Integración con SymPy para simplificar, evaluar y resolver ecuaciones complejas.
*   **Traza Visual:** Visualización en tiempo real del cambio de estados y el contenido de la **pila** mediante grafos de Graphviz.

### 2. 🧬 Lenguajes Regulares y Algoritmo de Thompson
*   **Regex a AFN:** Convierte expresiones regulares (`a|b`, `ab*`, `(a+b)*`) en Autómatas Finitos No Deterministas.
*   **Simulación de Cadenas:** Prueba cadenas sobre el autómata generado y observa cómo se calculan las **clausuras épsilon** y los estados activos.
*   **Navegación por Pasos:** Controles interactivos para retroceder o avanzar en la lectura de la cadena.

### 3. ⚙️ Intérprete de Pila (Stack Interpreter)
*   **Compilación a Código Intermedio:** Un compilador (`StackCompiler`) que utiliza un analizador léxico (`Lexer`) y un parser de descenso recursivo para convertir código fuente en instrucciones `OpCode`.
*   **Lenguaje Soportado:** Asignaciones, expresiones aritméticas, bloques `if/else` y ciclos `while`.
*   **Ejecución Paso a Paso:** El `StackInterpreter` ejecuta cada instrucción y produce un `ExecutionStep` con una instantánea completa de la pila y la memoria de variables.
*   **Traza Interactiva:** La vista navega por cada paso con animación de pila, tabla de memoria e instrucciones de código intermedio.

---

## 🛠️ Instalación y Uso

Sigue estos pasos para tener el laboratorio corriendo en tu máquina local:

### Requisitos Previos
* Python 3.9 o superior.
* Graphviz instalado en tu sistema (necesario para visualizar los grafos).

### Configuración
1. **Clona el repositorio:**
   ```bash
   git clone https://github.com/cesar-g-ramos/automata
   cd automata
   ```

2. **Instala las dependencias:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Ejecuta la aplicación:**
   ```bash
   streamlit run main.py
   ```
   También puedes probar esta opción si tienes problemas para ejecutar:
    ```bash
   python -m streamlit run main.py
   ```

---

## 📂 Estructura del Proyecto

El proyecto sigue una arquitectura **MVC (Modelo-Vista-Controlador)** adaptada para Streamlit:

```bash
.
├── main.py                        # 🎮 Orquestador principal (Entry Point)
├── models/                        # 🧠 Lógica de Negocio
│   ├── math_automata.py           # Autómata de Pila (PDA)
│   ├── math_engine.py             # Motor de cálculo (SymPy)
│   ├── regex_engine.py            # Orquestador de AFN
│   ├── regex_node.py              # Estructura de Nodos/Estados
│   ├── thompson_builder.py        # Algoritmo de Thompson
│   ├── stack_token.py             # Token y TokenType (enum)
│   ├── stack_lexer.py             # Analizador Léxico (Lexer)
│   ├── stack_instruction.py       # Instruction y OpCode (enum)
│   ├── stack_structure.py         # Estructura de datos Stack
│   ├── stack_compiler.py          # Compilador código fuente → OpCode
│   └── stack_interpreter.py      # Intérprete de instrucciones sobre pila
├── views/                         # 🖼️ Interfaces de Usuario
│   ├── math_view.py               # Interfaz de Álgebra y PDA
│   ├── regex_view.py              # Interfaz de Regex y AFN
│   └── stack_interpreter_view.py  # Interfaz del Intérprete de Pila
├── extractor.py                   # 🔍 Generador de meta-documentación (AST)
├── render.js                      # 🎨 Motor de renderizado del dashboard local
├── index.html                     # 📄 Dashboard de documentación interactiva
└── data.js                        # ⚡ Manifiesto generado por extractor.py
                                   #    (eliminar antes de regenerar)
```

---

## 🧪 Documentación Técnica Interactiva

Una de las joyas de este laboratorio es su capacidad de **auto-documentarse**. El sistema analiza el código fuente en tiempo de ejecución y genera un dashboard interactivo.

### ¿Cómo usarlo?
1. **Genera los datos:**
   Ejecuta el script de introspección para actualizar el manifiesto técnico:
   ```bash
   python extractor.py
   ```
2. **Abre la documentación:**
   Simplemente abre el archivo `index.html` en tu navegador favorito.

### ¿Qué verás en el Dashboard?
*   **Diagrama de Clases (Mermaid.js):** Representación completa de la arquitectura del proyecto, incluyendo el subsistema del Intérprete de Pila con sus 6 clases especializadas y las enumeraciones `OpCode` / `TokenType`.
*   **Explorador de Código:** Revisa la lógica de cada método y su documentación técnica (docstrings) sin salir del navegador.
*   **Flujo de Ejecución:** Diagrama visual del ciclo de vida de los datos, desde la entrada del usuario hasta la visualización del resultado.

### Módulos documentados (15 archivos analizados por AST)

| Categoría   | Módulo                      | Clase(s)                            |
|-------------|-----------------------------|-------------------------------------|
| Orquestador | `main.py`                   | `CompilerApp`                       |
| Modelo      | `math_automata.py`          | `MathAutomata`                      |
| Modelo      | `math_engine.py`            | `MathEngine`                        |
| Modelo      | `regex_engine.py`           | `RegexEngine`                       |
| Modelo      | `regex_node.py`             | `RegexNode`                         |
| Modelo      | `thompson_builder.py`       | `ThompsonBuilder`                   |
| Modelo      | `stack_token.py`            | `Token`, `TokenType`                |
| Modelo      | `stack_lexer.py`            | `Lexer`                             |
| Modelo      | `stack_instruction.py`      | `Instruction`, `OpCode`             |
| Modelo      | `stack_structure.py`        | `Stack`                             |
| Modelo      | `stack_compiler.py`         | `StackCompiler`                     |
| Modelo      | `stack_interpreter.py`      | `StackInterpreter`, `ExecutionStep` |
| Vista       | `math_view.py`              | `MathView`                          |
| Vista       | `regex_view.py`             | `RegexView`                         |
| Vista       | `stack_interpreter_view.py` | `StackInterpreterView`              |

---

## 🛠️ Tecnologías Utilizadas

*   **Frontend App:** [Streamlit](https://streamlit.io/)
*   **Matemáticas:** [SymPy](https://www.sympy.org/)
*   **Gráficos de Autómatas:** [Graphviz](https://graphviz.org/)
*   **Análisis de Código:** [Python AST](https://docs.python.org/3/library/ast.html) (Abstract Syntax Trees)
*   **Doc Dashboard:** TailwindCSS, [Mermaid.js](https://mermaid.js.org/) y JavaScript Vanilla.

---

## 🤝 Contribuciones

¿Quieres mejorar el algoritmo de Thompson o añadir soporte para Autómatas Deterministas?
1. Haz un Fork del proyecto.
2. Crea una rama con tu mejora (`git checkout -b feature/MejoraIncreible`).
3. Haz un commit de tus cambios (`git commit -am 'Add some MejoraIncreible'`).
4. Haz Push a la rama (`git push origin feature/MejoraIncreible`).
5. Abre un Pull Request.

---

## 📜 Licencia

Este proyecto fue desarrollado con fines académicos para el Laboratorio de Teoría de Compiladores. Libre para uso educativo.

---

Desarrollado con ❤️ por entusiastas de la teoría de la computación.
