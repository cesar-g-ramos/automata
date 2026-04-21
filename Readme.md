
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
   Puedes tambien probar esta opcion si tienes promblemas para ejecutar:
    ```bash
   python -m streamlit run main.py
   ```   

---

## 📂 Estructura del Proyecto

El proyecto sigue una arquitectura **MVC (Modelo-Vista-Controlador)** adaptada para Streamlit:

```bash
.
├── main.py                # 🎮 Orquestador principal (Entry Point)
├── models/                # 🧠 Lógica de Negocio
│   ├── math_automata.py   # Autómata de Pila (PDA)
│   ├── math_engine.py     # Motor de cálculo (SymPy)
│   ├── regex_engine.py    # Orquestador de AFN
│   ├── regex_node.py      # Estructura de Nodos/Estados
│   └── thompson_builder.py# Algoritmo de Thompson
├── views/                 # 🖼️ Interfaces de Usuario
│   ├── math_view.py       # Interfaz de Álgebra
│   └── regex_view.py      # Interfaz de Regex
└── extractor.py           # 🚀 Generador de Meta-documentación
└── render.js              # Configura la visualizacion de la documentacion local intectiva
└── index.html             # Muestra la documentación del proyecto de forma interactiva
└── data.js                # Archivo temporal que se genera cada vez que se ejecuta el extractor.py, "se debe eliminar antes de ejecutar el extractor.py"
```

---

## 🧪 Documentación Técnica Interactiva

Una de las joyas de este laboratorio es su capacidad de **auto-documentarse**. Hemos incluido un sistema que analiza el código fuente y genera un dashboard interactivo.

### ¿Cómo usarlo?
1. **Genera los datos:**
   Ejecuta el script de introspección para actualizar el manifiesto técnico:
   ```bash
   python extractor.py
   ```
2. **Abre la documentación:**
   Simplemente abre el archivo `index.html` en tu navegador favorito.

### ¿Qué verás en el Dashboard?
*   **Diagramas de Clases dinámicos** generados con Mermaid.js.
*   **Explorador de Código:** Revisa la lógica de cada método y su documentación técnica (docstrings) sin salir del navegador.
*   **Simulación de Flujo:** Un diagrama visual de cómo viajan los datos desde la entrada del usuario hasta el resultado final.

---

## 🛠️ Tecnologías Utilizadas

*   **Frontend:** [Streamlit](https://streamlit.io/)
*   **Matemáticas:** [SymPy](https://www.sympy.org/)
*   **Gráficos:** [Graphviz](https://graphviz.org/)
*   **Análisis de Código:** [Python AST](https://docs.python.org/3/library/ast.html) (Abstract Syntax Trees)
*   **Doc Dashboard:** TailwindCSS, Mermaid.js y JavaScript Vanilla.

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
