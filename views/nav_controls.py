"""
Componente de Navegación Paso a Paso — Reutilizable.

Controles disponibles:
  · ⏮ / ⏭  — saltar al primer / último paso.
  · ⬅️ / ➡️  — avanzar un paso a la vez.
  · Slider   — saltar directamente a cualquier paso.

Uso:
    from views.nav_controls import step_navigator

    st.session_state.mi_step = step_navigator(
        current   = st.session_state.mi_step,
        max_steps = max_step,
        key       = "mi_modulo",   # prefijo único por vista
    )
"""

import streamlit as st


def step_navigator(current: int, max_steps: int, key: str) -> int:
    """Renderiza los controles y devuelve el índice resultante (0…max_steps).

    Diseño de estado:
        {key}_idx    — fuente de verdad compartida entre botones y slider.
                       Se calcula cada rerun ANTES de renderizar el slider,
                       por lo que slider siempre recibe value <= max_value.
        {key}_slider — widget del slider; solo se usa para leer su valor
                       cuando el usuario lo arrastra.

    Args:
        current   : índice actual que maneja la vista llamante.
        max_steps : índice máximo válido (len(steps) - 1).
        key       : prefijo único ("math", "reg", "si", …).
    """

    idx_key    = f"{key}_idx"
    slider_key = f"{key}_slider"

    # ── 1. Inicializar la fuente de verdad ───────────────────────────── #
    if idx_key not in st.session_state:
        st.session_state[idx_key] = current

    # ── 2. Clamp defensivo — cubre cambios de programa (más/menos pasos) #
    st.session_state[idx_key] = max(0, min(st.session_state[idx_key], max_steps))

    # ── 3. Reconciliar con el slider si el usuario lo arrastró ────────── #
    #    El slider escribe en slider_key; si ese valor difiere del idx
    #    es porque el usuario movió el slider → adoptarlo como fuente.
    if slider_key in st.session_state:
        slider_val = max(0, min(st.session_state[slider_key], max_steps))
        if slider_val != st.session_state[idx_key]:
            st.session_state[idx_key] = slider_val

    idx = st.session_state[idx_key]

    # ── 4. Botones ───────────────────────────────────────────────────── #
    col_first, col_prev, col_label, col_next, col_last = st.columns(
        [1, 1, 4, 1, 1]
    )

    if col_first.button("⏮", key=f"{key}_first", help="Primer paso",
                        disabled=(idx == 0)):
        idx = 0

    if col_prev.button("⬅️", key=f"{key}_prev", help="Paso anterior",
                       disabled=(idx == 0)):
        idx = max(0, idx - 1)

    col_label.markdown(
        f"<div style='text-align:center;padding-top:6px;font-size:13px'>"
        f"Paso <b>{idx}</b> de <b>{max_steps}</b></div>",
        unsafe_allow_html=True,
    )

    if col_next.button("➡️", key=f"{key}_next", help="Paso siguiente",
                       disabled=(idx == max_steps)):
        idx = min(max_steps, idx + 1)

    if col_last.button("⏭", key=f"{key}_last", help="Último paso",
                       disabled=(idx == max_steps)):
        idx = max_steps

    # ── 5. Escribir la fuente de verdad ANTES de renderizar el slider ── #
    #    Aquí está el fix definitivo: idx ya tiene el valor correcto y
    #    está garantizado dentro de [0, max_steps]. Al asignarlo a
    #    slider_key justo antes de st.slider(), el slider nunca recibe
    #    un value > max_value.
    st.session_state[idx_key]    = idx
    st.session_state[slider_key] = idx   # ← sincronizar siempre

    # ── 6. Renderizar el slider (ya con value garantizado en rango) ───── #
    if max_steps > 1:
        st.slider(
            label="Saltar a paso:",
            min_value=0,
            max_value=max_steps,
            key=slider_key,
            label_visibility="collapsed",
        )
        # Si el usuario movió el slider en ESTE rerun, actualizar idx_key
        st.session_state[idx_key] = st.session_state[slider_key]
        idx = st.session_state[idx_key]

    return idx