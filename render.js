/**
 * Motor de Renderizado para Laboratorio de Autómatas y Compiladores.
 * Gestiona la generación del diagrama de clases (Mermaid.js), el explorador
 * interactivo de archivos y la simulación de flujo del sistema.
 *
 * Diagrama de clases: representación estática fiel al diseño arquitectónico
 * del proyecto, incluyendo los módulos del Intérprete de Pila incorporados
 * en la versión actual.
 */

const UI = {
    currentZoom: 1,

    // ── Diagrama de Clases (Mermaid.js estático) ─────────────────────────
    renderDiagram: () => {
        mermaid.initialize({
            startOnLoad: false,
            theme: 'base',
            themeVariables: {
                primaryColor: '#0f172a',
                primaryTextColor: '#f8fafc',
                primaryBorderColor: '#38bdf8',
                lineColor: '#64748b',
                secondaryColor: '#1e293b',
                tertiaryColor: '#020617',
                fontFamily: 'Inter',
                fontSize: '13px',
                classText: '#f8fafc'
            }
        });

        // Diagrama de clases completo — refleja la arquitectura real del proyecto.
        // Incluye: Orquestador, Vistas MVC, Modelos de Autómatas/Regex y el
        // subsistema del Intérprete de Pila (Lexer, Compiler, Interpreter, Stack).
        const graph = `classDiagram
    %% ── Orquestador ──────────────────────────────────────────────────────
    class CompilerApp {
        +math_view : MathView
        +regex_view : RegexView
        +interpreter_view : StackInterpreterView
        +run()
        +show_sidebar()
    }

    %% ── Vistas ───────────────────────────────────────────────────────────
    class MathView {
        -automata : MathAutomata
        -engine : MathEngine
        +show()
        +generate_graphviz()
    }
    class RegexView {
        -engine : RegexEngine
        +show()
        +render_afn()
    }
    class StackInterpreterView {
        -interpreter : StackInterpreter
        -compiler : StackCompiler
        +show()
        +render_step_trace()
    }

    %% ── Modelos: Autómatas y Expresiones Regulares ───────────────────────
    class MathAutomata {
        -transitions : dict
        -estados_aceptacion : list
        +validate()
        +get_char_type()
        +process_to_tuples()
    }
    class MathEngine {
        +prepare_for_sympy()
        +solve_symbolic()
        -_format_solutions()
    }
    class RegexEngine {
        -builder : ThompsonBuilder
        +parse_regex_to_afn()
        +simulate_afn()
        +get_epsilon_closure()
    }

    %% ── Modelos: Intérprete de Pila ──────────────────────────────────────
    class StackInterpreter {
        -stack : Stack
        -memory : dict
        -instructions : list
        -ip : int
        +run(instructions)
        +step()
        +reset()
    }
    class StackCompiler {
        -lexer : Lexer
        -tokens : list
        -pos : int
        +compile(src)
        -_parse_assign()
        -_parse_expr()
        -_parse_condition()
        -_parse_if()
        -_parse_while()
    }
    class Lexer {
        -source : str
        -pos : int
        +tokenize()
        -_next_token()
    }
    class Stack {
        -_data : list
        +push(value)
        +pop()
        +peek()
        +is_empty()
        +snapshot()
    }
    class ExecutionStep {
        +step_num : int
        +instruction : Instruction
        +stack_snapshot : list
        +memory_snapshot : dict
        +describe()
    }
    class Instruction {
        +opcode : OpCode
        +operand : Any
        +__repr__()
    }
    class Token {
        +type : TokenType
        +value : str
        +line : int
        +__repr__()
    }
    class OpCode {
        <<enumeration>>
        PUSH
        POP
        LOAD
        STORE
        ADD
        SUB
        MUL
        DIV
        JUMP_IF_FALSE
        JUMP
        LABEL
    }
    class TokenType {
        <<enumeration>>
        NUMBER
        IDENTIFIER
        ASSIGN
        OPERATOR
        IF
        ELSE
        WHILE
        LPAREN
        RPAREN
        EOF
    }

    %% ── Relaciones: Orquestador → Vistas ─────────────────────────────────
    CompilerApp ..> MathView             : crea
    CompilerApp ..> RegexView            : crea
    CompilerApp ..> StackInterpreterView : crea

    %% ── Relaciones: Vistas → Modelos ─────────────────────────────────────
    MathView ..> MathAutomata            : usa
    MathView ..> MathEngine              : usa
    RegexView ..> RegexEngine            : usa

    %% ── Relaciones: StackInterpreterView → Stack subsistema ──────────────
    StackInterpreterView --> StackInterpreter : compone
    StackInterpreterView --> StackCompiler    : compone

    %% ── Relaciones internas del Intérprete de Pila ───────────────────────
    StackInterpreter --> Stack            : compone
    StackInterpreter ..> ExecutionStep   : crea
    StackInterpreter ..> Instruction     : lee
    StackCompiler    --> Lexer            : compone
    StackCompiler    ..> Instruction     : crea
    ExecutionStep    --> Instruction     : referencia
    Lexer            ..> Token           : crea
    Token            --> TokenType       : usa
    Instruction      --> OpCode          : usa`;

        const element = document.getElementById('mermaid-diagram');

        mermaid.render('prepared-diagram', graph).then(({ svg }) => {
            element.innerHTML = svg;
            const svgEl = element.querySelector('svg');
            svgEl.style.width = '100%';
            svgEl.style.height = 'auto';
            UI.initPanZoom();
        }).catch(err => {
            console.error('Mermaid render error:', err);
            element.innerHTML = `<p class="text-red-400 p-4">Error al renderizar el diagrama: ${err.message}</p>`;
        });
    },

    // Controles de Interactividad
    zoomDiagram: (factor) => {
        UI.currentZoom *= factor;
        UI.applyTransform();
    },

    resetDiagram: () => {
        UI.currentZoom = 1;
        UI.applyTransform();
    },

    applyTransform: () => {
        const container = document.getElementById('mermaid-container');
        container.style.transform = `scale(${UI.currentZoom})`;
    },

    initPanZoom: () => {
        const viewport = document.getElementById('diagram-viewport');
        const container = document.getElementById('mermaid-container');
        let isDragging = false;
        let startX, startY, scrollLeft, scrollTop;

        viewport.addEventListener('mousedown', (e) => {
            isDragging = true;
            startX = e.pageX - viewport.offsetLeft;
            startY = e.pageY - viewport.offsetTop;
            scrollLeft = viewport.scrollLeft;
            scrollTop = viewport.scrollTop;
        });

        viewport.addEventListener('mouseleave', () => isDragging = false);
        viewport.addEventListener('mouseup', () => isDragging = false);

        viewport.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            e.preventDefault();
            const x = e.pageX - viewport.offsetLeft;
            const y = e.pageY - viewport.offsetTop;
            const walkX = (x - startX) * 2;
            const walkY = (y - startY) * 2;
            viewport.scrollLeft = scrollLeft - walkX;
            viewport.scrollTop = scrollTop - walkY;
        });
    },

    // Generar Árbol de Archivos
    renderFileTree: () => {
        const tree = document.getElementById('file-tree');
        let html = '<h4 class="text-xs font-bold text-sky-500 uppercase mb-4 tracking-widest">Estructura de Proyecto</h4>';
        
        const categories = [...new Set(projectData.map(d => d.category))];
        categories.forEach(cat => {
            html += `<div class="mb-4"><span class="text-[10px] text-slate-500 font-bold uppercase">${cat}</span>`;
            projectData.filter(d => d.category === cat).forEach(file => {
                html += `
                <button onclick="UI.showDetail('${file.filename}')" class="flex items-center gap-2 w-full p-2 hover:bg-white/5 rounded-lg text-sm text-slate-300 transition group">
                    <i class="far fa-file-code text-sky-500"></i>
                    <span class="group-hover:text-white">${file.filename}</span>
                </button>`;
            });
            html += `</div>`;
        });
        tree.innerHTML = html;
    },

    // Mostrar Detalle de Archivo
    showDetail: (filename) => {
        const file = projectData.find(f => f.filename === filename);
        const detail = document.getElementById('detail-view');
        
        detail.innerHTML = `
            <div class="animate-in fade-in slide-in-from-right-4 duration-500">
                <div class="flex items-center justify-between mb-8">
                    <h2 class="text-3xl font-black text-white">${file.filename}</h2>
                    <span class="px-3 py-1 bg-sky-500/10 text-sky-400 border border-sky-500/20 rounded-full text-[10px] uppercase font-bold">${file.category}</span>
                </div>
                <p class="text-slate-400 mb-10 leading-relaxed italic">${file.module_doc}</p>
                
                <div class="space-y-12">
                    ${file.classes.map(cls => `
                        <div class="border-l-2 border-sky-500/30 pl-6 space-y-4">
                            <h3 class="text-xl font-bold text-white"><i class="fas fa-cube text-sky-500 mr-2"></i>Clase: ${cls.name}</h3>
                            <p class="text-sm text-slate-500">${cls.doc}</p>
                            <div class="grid gap-4">
                                ${cls.methods.map(meth => `
                                    <div class="bg-black/20 rounded-xl p-4 border border-white/5">
                                        <div class="flex justify-between items-center mb-2">
                                            <code class="text-sky-400 font-bold">${meth.name}()</code>
                                        </div>
                                        <p class="text-xs text-slate-500 mb-4">${meth.doc}</p>
                                        <pre class="mono text-[10px] bg-black/40 p-4 rounded-lg text-indigo-300 overflow-x-auto"><code>${UI.escape(meth.code)}</code></pre>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    },

    // ── Simulación de Proceso Iterativo ──────────────────────────────────
    renderSimulation: () => {
        const steps = [
            { name: "Entrada Usuario", icon: "fa-keyboard",      desc: "main.py inicia el loop de Streamlit y captura la expresión o el código fuente.", color: "text-white" },
            { name: "Controlador",     icon: "fa-route",          desc: "CompilerApp delega a MathView, RegexView o StackInterpreterView según la pestaña activa.", color: "text-sky-500" },
            { name: "Compilación",     icon: "fa-code",           desc: "StackCompiler invoca al Lexer para tokenizar y genera instrucciones de código intermedio (OpCode).", color: "text-amber-500" },
            { name: "Ejecución",       icon: "fa-gears",          desc: "StackInterpreter ejecuta las instrucciones sobre la pila, produciendo un ExecutionStep por cada paso.", color: "text-purple-500" },
            { name: "Resultado",       icon: "fa-check-double",   desc: "La Vista renderiza la traza de pila, la memoria de variables y los grafos de autómatas.", color: "text-emerald-500" }
        ];

        const container = document.getElementById('simulation-flow');
        container.innerHTML = steps.map((step, idx) => `
            <div class="flex flex-col items-center text-center max-w-[180px] group">
                <div class="w-16 h-16 rounded-2xl glass flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-500">
                    <i class="fas ${step.icon} ${step.color} text-2xl"></i>
                </div>
                <h4 class="font-bold text-white text-sm mb-2">${step.name}</h4>
                <p class="text-[10px] text-slate-500 leading-tight">${step.desc}</p>
                ${idx < steps.length - 1 ? '<i class="fas fa-chevron-right absolute hidden md:block text-slate-800" style="left: '+(idx*20 + 15)+'%"></i>' : ''}
            </div>
        `).join('');
    },

    escape: (text) => text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"),

    init: () => {
        UI.renderDiagram();
        UI.renderFileTree();
        UI.renderSimulation();
    }
};

document.addEventListener('DOMContentLoaded', UI.init);