document.addEventListener('DOMContentLoaded', () => {
    // --- ESTRUCTURA DE DATOS: RAMOS Y REQUISITOS ---
    // Cada ramo tiene un ID único, su nombre, el semestre al que pertenece,
    // y una lista de IDs de los ramos que son sus requisitos.
    // NOTA: He interpretado tu lista de requisitos como "Requisito -> Ramo que lo necesita".
    // Ejemplo: 'fund_contabilidad' es requisito para 'taller_fin_apl'.
    const ramos = [
        // Semestre 1
        { id: 'fund_contabilidad', nombre: 'FUNDAMENTOS DE CONTABILIDAD', semestre: 1, requisitos: [] },
        { id: 'normas_proc', nombre: 'NORMAS Y PROCEDIMIENTOS', semestre: 1, requisitos: [] },
        { id: 'fund_economia', nombre: 'FUNDAMENTOS DE ECONOMIA', semestre: 1, requisitos: [] },
        { id: 'herr_tec_1', nombre: 'HERRAMIENTAS TECNOLÓGICAS I', semestre: 1, requisitos: [] },
        { id: 'niv_mat', nombre: 'NIVELACIÓN MATEMÁTICA', semestre: 1, requisitos: [] },

        // Semestre 2
        { id: 'marketing', nombre: 'MARKETING', semestre: 2, requisitos: [] },
        { id: 'taller_admin_pers', nombre: 'TALLER DE ADMINISTRACIÓN DE PERSONAL', semestre: 2, requisitos: [] },
        { id: 'herr_tec_2', nombre: 'HERRAMIENTAS TECNOLÓGICAS II', semestre: 2, requisitos: ['herr_tec_1'] },
        { id: 'hab_com_trabajo', nombre: 'HABILIDADES DE COMUNICACIÓN PARA EL TRABAJO', semestre: 2, requisitos: [] },
        { id: 'herr_analisis_gestion', nombre: 'HERRAMIENTAS DE ANÁLISIS PARA LA GESTIÓN', semestre: 2, requisitos: ['niv_mat'] },
        { id: 'fund_antropologia', nombre: 'FUNDAMENTOS DE ANTROPOLOGÍA', semestre: 2, requisitos: [] },

        // Semestre 3
        { id: 'intro_emprendimiento', nombre: 'INTRODUCCIÓN AL EMPRENDIMIENTO', semestre: 3, requisitos: [] },
        { id: 'gestion_personas', nombre: 'GESTIÓN DE PERSONAS', semestre: 3, requisitos: [] },
        { id: 'herr_tec_3', nombre: 'HERRAMIENTAS TECNOLÓGICAS III', semestre: 3, requisitos: ['herr_tec_2'] },
        { id: 'taller_fin_apl', nombre: 'TALLER DE FINANZAS APLICADAS', semestre: 3, requisitos: ['fund_contabilidad'] },
        { id: 'hab_comunicacionales', nombre: 'HABILIDADES COMUNICACIONALES', semestre: 3, requisitos: [] }, // Asumiendo que es una continuación conceptual y no un requisito duro
        { id: 'practica_laboral_1', nombre: 'PRÁCTICA LABORAL', semestre: 3, requisitos: [] },

        // Semestre 4
        { id: 'costos_presup_1', nombre: 'COSTOS Y PRESUPUESTOS I', semestre: 4, requisitos: [] },
        { id: 'ventas', nombre: 'VENTAS', semestre: 4, requisitos: [] },
        { id: 'microeconomia', nombre: 'MICROECONOMÍA', semestre: 4, requisitos: ['fund_economia'] },
        { id: 'etica_trabajo', nombre: 'ÉTICA PARA EL TRABAJO', semestre: 4, requisitos: ['fund_antropologia'] },

        // Semestre 5
        { id: 'finanzas', nombre: 'FINANZAS', semestre: 5, requisitos: ['taller_fin_apl'] },
        { id: 'costos_presup_2', nombre: 'COSTOS Y PRESUPUESTOS II', semestre: 5, requisitos: ['costos_presup_1'] },
        { id: 'taller_financiamiento', nombre: 'TALLER DE FINANCIAMIENTO', semestre: 5, requisitos: ['normas_proc', 'taller_fin_apl'] },
        { id: 'admin_estrategica', nombre: 'ADMINISTRACIÓN ESTRATÉGICA', semestre: 5, requisitos: [] },
        { id: 'app_estadistica', nombre: 'APLICACIONES DE LA ESTADÍSTICA', semestre: 5, requisitos: ['herr_analisis_gestion'] },
        
        // Semestre 6
        { id: 'finanzas_corp', nombre: 'FINANZAS CORPORATIVAS', semestre: 6, requisitos: ['finanzas'] },
        { id: 'taller_tesoreria', nombre: 'TALLER DE TESORERÍA', semestre: 6, requisitos: ['costos_presup_1', 'finanzas'] },
        { id: 'control_gestion', nombre: 'CONTROL DE GESTIÓN', semestre: 6, requisitos: [] },
        { id: 'proyectos_innovacion', nombre: 'PROYECTOS DE INNOVACIÓN', semestre: 6, requisitos: [] },
        { id: 'big_data', nombre: 'BIG DATA E INTELIGENCIA DE NEGOCIOS', semestre: 6, requisitos: ['niv_mat'] },
        { id: 'etica_profesional', nombre: 'ÉTICA PROFESIONAL', semestre: 6, requisitos: ['etica_trabajo'] },

        // Semestre 7
        { id: 'mercado_capitales', nombre: 'MERCADO DE CAPITALES', semestre: 7, requisitos: ['finanzas_corp'] },
        { id: 'form_eval_proyectos', nombre: 'FORMULACIÓN, PREPARACIÓN Y EVALUACIÓN DE PROYECTOS', semestre: 7, requisitos: ['admin_estrategica', 'taller_fin_apl'] },
        { id: 'estrategias_comerciales', nombre: 'ESTRATEGIAS COMERCIALES', semestre: 7, requisitos: ['marketing'] },
        { id: 'sostenibilidad', nombre: 'SOSTENIBILIDAD', semestre: 7, requisitos: [] },
        { id: 'gestion_erp', nombre: 'GESTIÓN EN SISTEMA ERP', semestre: 7, requisitos: [] },
        { id: 'practica_laboral_2', nombre: 'PRÁCTICA LABORAL', semestre: 7, requisitos: [] },
        
        // Semestre 8
        { id: 'taller_inversiones', nombre: 'TALLER DE INVERSIONES', semestre: 8, requisitos: ['mercado_capitales'] },
        { id: 'negociacion_liderazgo', nombre: 'NEGOCIACIÓN Y LIDERAZGO', semestre: 8, requisitos: [] },
        { id: 'taller_aplicada_finanzas', nombre: 'TALLER APLICADA: FINANZAS', semestre: 8, requisitos: ['finanzas_corp'] }
    ];

    // --- ESTADO DE LA APLICACIÓN ---
    let ramosAprobados = new Set(JSON.parse(localStorage.getItem('ramosAprobados')) || []);

    // --- ELEMENTOS DEL DOM ---
    const mallaContainer = document.getElementById('malla-container');
    const notificacionEl = document.getElementById('notificacion');
    const mensajeMotivacionalEl = document.getElementById('mensaje-motivacional');

    // --- FUNCIONES ---

    /**
     * Guarda el conjunto de ramos aprobados en el localStorage del navegador.
     */
    const guardarEstado = () => {
        localStorage.setItem('ramosAprobados', JSON.stringify(Array.from(ramosAprobados)));
    };

    /**
     * Muestra una notificación temporal en la pantalla.
     * @param {string} mensaje - El mensaje a mostrar.
     */
    const mostrarNotificacion = (mensaje) => {
        notificacionEl.innerHTML = mensaje;
        notificacionEl.classList.add('visible');
        setTimeout(() => {
            notificacionEl.classList.remove('visible');
        }, 3000); // La notificación desaparece después de 3 segundos
    };

    /**
     * Renderiza toda la malla curricular en el DOM.
     */
    const renderizarMalla = () => {
        mallaContainer.innerHTML = ''; // Limpiar el contenedor
        const maxSemestre = Math.max(...ramos.map(r => r.semestre));

        for (let i = 1; i <= maxSemestre; i++) {
            const semestreColumna = document.createElement('div');
            semestreColumna.className = 'semestre-columna';
            
            const semestreTitulo = document.createElement('h2');
            semestreTitulo.className = 'semestre-titulo';
            semestreTitulo.textContent = `Semestre ${i}`;
            semestreColumna.appendChild(semestreTitulo);

            const ramosDelSemestre = ramos.filter(r => r.semestre === i);
            ramosDelSemestre.forEach(ramo => {
                const ramoDiv = document.createElement('div');
                ramoDiv.className = 'ramo';
                ramoDiv.dataset.id = ramo.id;
                ramoDiv.textContent = ramo.nombre;
                semestreColumna.appendChild(ramoDiv);
            });
            mallaContainer.appendChild(semestreColumna);
        }
        actualizarVisualizacionRamos();
    };

    /**
     * Actualiza las clases CSS de cada ramo (aprobado, bloqueado, normal)
     * basándose en el estado actual de ramosAprobados.
     */
    const actualizarVisualizacionRamos = () => {
        document.querySelectorAll('.ramo').forEach(ramoDiv => {
            const id = ramoDiv.dataset.id;
            const ramoData = ramos.find(r => r.id === id);
            
            // Comprobar si los requisitos están cumplidos
            const requisitosCumplidos = ramoData.requisitos.every(reqId => ramosAprobados.has(reqId));

            ramoDiv.classList.remove('aprobado', 'bloqueado');

            if (ramosAprobados.has(id)) {
                ramoDiv.classList.add('aprobado');
            } else if (!requisitosCumplidos) {
                ramoDiv.classList.add('bloqueado');
            }
        });
    };
    
    /**
     * Maneja el evento de clic en un ramo.
     * @param {Event} e - El objeto del evento.
     */
    const manejarClickRamo = (e) => {
        const ramoDiv = e.target.closest('.ramo');
        if (!ramoDiv) return; // No se hizo clic en un ramo

        const id = ramoDiv.dataset.id;
        const ramoData = ramos.find(r => r.id === id);

        // Si el ramo está bloqueado, mostrar un mensaje y no hacer nada más
        if (ramoDiv.classList.contains('bloqueado')) {
            const requisitosFaltantes = ramoData.requisitos
                .filter(reqId => !ramosAprobados.has(reqId))
                .map(reqId => ramos.find(r => r.id === reqId).nombre);
            
            mostrarNotificacion(`<strong>Ramo bloqueado.</strong><br>Necesitas aprobar: ${requisitosFaltantes.join(', ')}`);
            return;
        }

        // Si no está bloqueado, cambiar su estado (aprobar/desaprobar)
        if (ramosAprobados.has(id)) {
            ramosAprobados.delete(id);
        } else {
            ramosAprobados.add(id);
        }

        guardarEstado();
        actualizarVisualizacionRamos();
    };
    
    /**
     * Muestra un mensaje motivacional aleatorio.
     */
    const mostrarMensajeMotivacional = () => {
        const mensajes = [
            "El éxito es la suma de pequeños esfuerzos repetidos día tras día.",
            "Cree en ti y todo será posible.",
            "La mejor forma de predecir el futuro es crearlo.",
            "Cada logro comienza con la decisión de intentarlo.",
            "No te detengas hasta que te sientas orgulloso."
        ];
        const mensajeAleatorio = mensajes[Math.floor(Math.random() * mensajes.length)];
        mensajeMotivacionalEl.textContent = `✨ ${mensajeAleatorio} ✨`;
    };


    // --- INICIALIZACIÓN ---
    mallaContainer.addEventListener('click', manejarClickRamo);
    renderizarMalla();
    mostrarMensajeMotivacional();
});

