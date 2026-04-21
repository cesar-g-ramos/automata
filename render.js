/**
 * Motor de Renderizado para Laboratorio de Compiladores.
 * Gestiona la generación de diagramas, el explorador interactivo y la simulación de flujo.
 */

const UI = {
    currentZoom: 1,

    // Configuración y Renderizado del Diagrama
    renderDiagram: () => {
        // Estilo personalizado para Mermaid que coincida con el proyecto
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
                fontSize: '14px'
            }
        });

        let graph = "classDiagram\n";
        // Definición de Clases
        projectData.forEach(mod => {
            mod.classes.forEach(cls => {
                graph += `    class ${cls.name} {\n`;
                cls.attributes.forEach(attr => graph += `        +${attr}\n`);
                cls.methods.forEach(meth => graph += `        +${meth.name}()\n`);
                graph += "    }\n";
            });
        });

        // Relaciones sugeridas (opcional, para conectar vistas y motores)
        graph += "    MathView ..> MathEngine : Usa\n";
        graph += "    MathView ..> MathAutomata : Valida\n";
        graph += "    RegexView ..> RegexEngine : Usa\n";
        graph += "    RegexEngine ..> ThompsonBuilder : Construye\n";

        const element = document.getElementById('mermaid-diagram');
        
        // Renderizado manual para mejor control
        mermaid.render('prepared-diagram', graph).then(({ svg }) => {
            element.innerHTML = svg;
            // Ajustar el SVG para que sea responsivo
            const svgEl = element.querySelector('svg');
            svgEl.style.width = '100%';
            svgEl.style.height = 'auto';
            UI.initPanZoom();
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

    // Simulación de Proceso Iterativo
    renderSimulation: () => {
        const steps = [
            { name: "Entrada Usuario", icon: "fa-keyboard", desc: "main.py inicia el loop de Streamlit y captura la expresión.", color: "text-white" },
            { name: "Controlador", icon: "fa-route", desc: "CompilerApp delega a MathView o RegexView según la pestaña.", color: "text-sky-500" },
            { name: "Procesamiento", icon: "fa-gears", desc: "MathEngine o RegexEngine procesan la lógica usando SymPy o Thompson.", color: "text-amber-500" },
            { name: "Validación", icon: "fa-vial", desc: "MathAutomata valida la sintaxis mediante estados de pila.", color: "text-purple-500" },
            { name: "Resultado", icon: "fa-check-double", desc: "La Vista renderiza los grafos y soluciones finales.", color: "text-emerald-500" }
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