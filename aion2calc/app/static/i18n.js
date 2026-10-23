/* Small, local interface dictionary. Game, item, skill and character names remain unchanged. */
"use strict";

(() => {
  const STORAGE_KEY = "aion2calc-language";
  const es = {
    "Home": "Inicio",
    "Character & builds": "Personaje y configuraciones",
    "Combat": "Combate",
    "Game tools": "Herramientas del juego",
    "App": "Aplicación",
    "Help & community": "Ayuda y comunidad",
    "Application screenshot": "Captura de la aplicación",
    "Theme: follow the computer": "Tema: seguir el sistema",
    "Stop the app": "Cerrar la aplicación",
    "Main navigation": "Navegación principal",
    "Local game database status": "Estado de la base de datos local",
    "Import your character": "Importa tu personaje",
    "Find your public profile and load your current character and equipped items.": "Busca tu perfil público y carga tu personaje actual y los objetos equipados.",
    "Equipment & recommendations": "Equipo y recomendaciones",
    "Review your equipped items, Genus data and personalized upgrade recommendations.": "Revisa tu equipo, los datos de Genus y las recomendaciones de mejora personalizadas.",
    "Compare builds and optimize stats, skills and equipment for your goals.": "Compara configuraciones y optimiza estadísticas, habilidades y equipo según tus objetivos.",
    "Create, compare and manage build configurations.": "Crea, compara y administra configuraciones.",
    "Return to recommendations and calculations you saved.": "Consulta las recomendaciones y los cálculos que guardaste.",
    "Live combat meter": "Medidor de combate en vivo",
    "Capture a fight locally, then review live damage and save the combat log.": "Registra un combate localmente, revisa el daño en vivo y guarda el registro.",
    "Combat logs": "Registros de combate",
    "Import, review and compare combat recordings.": "Importa, revisa y compara registros de combate.",
    "Combat log details": "Detalles del registro de combate",
    "Review the selected recording and its encounter details.": "Revisa el registro seleccionado y los detalles del encuentro.",
    "Raid planner": "Planificador de incursiones",
    "Prepare encounter assignments and strategy with your group.": "Prepara la estrategia y las asignaciones del encuentro con tu grupo.",
    "Track upcoming world events and field bosses.": "Consulta los próximos eventos del mundo y jefes de campo.",
    "Game database": "Base de datos del juego",
    "Browse the local game data available to the app.": "Explora los datos locales del juego disponibles en la aplicación.",
    "Explore game maps and locations.": "Explora los mapas y las ubicaciones del juego.",
    "Browse crafting recipes and materials.": "Consulta recetas de fabricación y materiales.",
    "Read the latest game and community updates.": "Lee las últimas novedades del juego y de la comunidad.",
    "Personalize the interface, overlay and local app behavior.": "Personaliza la interfaz, la superposición y el funcionamiento local de la aplicación.",
    "Character setup": "Configuración del personaje",
    "Aion 2 Calc": "Aion 2 Calc",
    "Plan and review your character.": "Planifica y revisa tu personaje.",
    "AION 2 · CHARACTER WORKSPACE": "AION 2 · ESPACIO DE PERSONAJE",
    "Welcome to Aion 2 Calc": "Te damos la bienvenida a Aion 2 Calc",
    "Import your character, review your equipment and find your next upgrade — or jump straight into combat tools.": "Importa tu personaje, revisa tu equipo y encuentra tu próxima mejora, o ve directamente a las herramientas de combate.",
    "Import a character": "Importar personaje",
    "START HERE": "EMPIEZA AQUÍ",
    "REVIEW": "REVISA",
    "OPTIMIZE": "OPTIMIZA",
    "Load your public profile and equipped items.": "Carga tu perfil público y los objetos equipados.",
    "Inspect Genus and see what to improve next.": "Revisa Genus y descubre qué mejorar después.",
    "Compare stats and plan your target build.": "Compara estadísticas y planifica tu configuración objetivo.",
    "Import character": "Importar personaje",
    "View recommendations": "Ver recomendaciones",
    "Open planner": "Abrir planificador",
    "From your current gear to a more optimized build.": "Desde tu equipo actual hasta una configuración más optimizada.",
    "Capture, inspect and plan around your encounters.": "Registra y analiza tus encuentros y planifica tus estrategias.",
    "Capture a fight and review damage in real time.": "Registra un combate y revisa el daño en tiempo real.",
    "Import recordings and analyze encounters.": "Importa registros y analiza encuentros.",
    "Prepare a strategy with your group.": "Prepara una estrategia con tu grupo.",
    "Keep track of events and field bosses.": "Sigue los eventos y jefes de campo.",
    "Reference data and useful utilities.": "Datos de referencia y herramientas útiles.",
    "Saved builds": "Configuraciones guardadas",
    "Build Planner": "Planificador de configuraciones",
    "Live Meter": "Medidor en vivo",
    "Planner": "Planificador",
    "Builds": "Configuraciones",
    "My Character": "Mi personaje",
    "Gear & Advice": "Equipo y recomendaciones",
    "Saved Results": "Resultados guardados",
    "Combat Logs": "Registros de combate",
    "Raid Planner": "Planificador de incursiones",
    "Database": "Base de datos",
    "Maps": "Mapas",
    "Crafting": "Fabricación",
    "Timers": "Temporizadores",
    "News": "Noticias",
    "Language": "Idioma",
    "Choose the language used by the app interface. This preference stays in this browser.": "Elige el idioma de la interfaz. Esta preferencia se guarda en este navegador.",
    "AION 2 build planner & combat analyzer": "Planificador de configuraciones y analizador de combate de AION 2",
    "Build planner": "Planificador de configuraciones",
    "My character": "Mi personaje",
    "import from the official AION 2 character page, then optimize it with the same gear": "Importa el personaje desde la página oficial de AION 2 y optimízalo con el mismo equipo",
    "search by name or paste a MetaBot profile link, then import the official AION 2 character data": "Busca por nombre o pega un enlace de perfil de MetaBot y luego importa los datos oficiales del personaje de AION 2",
    "Character name": "Nombre del personaje",
    "Character name or MetaBot profile URL": "Nombre del personaje o enlace de perfil de MetaBot",
    "When you paste a MetaBot profile link, the app matches its region, server and character name against the official AION 2 profile service before importing.": "Al pegar un enlace de MetaBot, la aplicación verifica la región, el servidor y el nombre del personaje con el servicio oficial de perfiles de AION 2 antes de importarlo.",
    "North America": "Norteamérica",
    "Europe": "Europa",
    "Asia": "Asia",
    "Latin America": "Latinoamérica",
    "Search": "Buscar",
    "Import": "Importar",
    "Name": "Nombre",
    "Level": "Nivel",
    "Server": "Servidor",
    "found": "encontrados",
    "Import a character on My Character first.": "Primero importa un personaje en «Mi personaje».",
    "Imported before · newest first (click to fetch current profile):": "Importados anteriormente · más recientes primero (haz clic para actualizar el perfil):",
    "Gear & advice": "Equipo y recomendaciones",
    "Saved advice": "Recomendaciones guardadas",
    "what to wear from your inventory, goal gear, upgrade path, arcana, pantheon, genus insight — on simulated DPS": "Qué equipar de tu inventario, equipo objetivo, ruta de mejoras, arcana, panteón e introspección de genus — según DPS simulado",
    "Run advice": "Calcular recomendaciones",
    "Calculating advice…": "Calculando recomendaciones…",
    "Calculating advice ·": "Calculando recomendaciones ·",
    "Advice complete.": "Recomendaciones listas.",
    "View results ↓": "Ver resultados ↓",
    "Advice did not complete:": "No se pudieron calcular las recomendaciones:",
    "Import the character on My Character first. The official page shows only equipped items: add bag and warehouse items below so the planner can use them. Fights you import on Combat Logs are matched to the gear the character wore and calibrate the model.": "Primero importa el personaje en «Mi personaje». La página oficial solo muestra los objetos equipados: añade aquí los objetos de la bolsa o almacén para incluirlos. Los combates importados en «Registros de combate» se vinculan al equipo usado y ayudan a calibrar el modelo.",
    "INVENTORY": "INVENTARIO",
    "Slot": "Ranura",
    "Item": "Objeto",
    "Skill options": "Opciones de habilidad",
    "Source": "Origen",
    "Remove": "Quitar",
    "search the catalog to add an item": "busca un objeto en el catálogo para añadirlo",
    "enchant level": "nivel de encantamiento",
    "skill options, e.g. Hellfire=2, Blaze=1": "opciones de habilidad, p. ej. Hellfire=2, Blaze=1",
    "GENUS INSIGHT": "INTROSPECCIÓN DE GENUS",
    "TITLES YOU OWN": "TÍTULOS QUE TIENES",
    "The official page shows only equipped titles. One title name per line (copy them from the in-game Titles window).": "La página oficial solo muestra los títulos equipados. Escribe un título por línea (cópialos de la ventana de títulos del juego).",
    "Save titles": "Guardar títulos",
    "Added": "Añadido",
    "Saved": "Guardado",
    "Save your Genus lines before running advice.": "Guarda tus líneas de Genus antes de calcular recomendaciones.",
    "Save your Genus lines first.": "Guarda primero tus líneas de Genus.",
    "Genus lines saved. Run advice again to update recommendations.": "Líneas de Genus guardadas. Vuelve a calcular para actualizar las recomendaciones.",
    "Use overlay capture": "Usar captura del overlay",
    "Genus screen data loaded as a draft. Review every line, then save genus lines.": "Datos de Genus cargados como borrador. Revisa cada línea y guarda las líneas.",
    "No reviewed Genus capture is waiting.": "No hay ninguna captura revisada de Genus pendiente.",
    "Genus screen capture is waiting. Use Load reviewed capture when you are ready.": "La captura de Genus está pendiente. Pulsa «Cargar captura revisada» cuando quieras cargarla.",
    "Genus capture data is already loaded as a draft. Review it and save Genus lines.": "Los datos de la captura de Genus ya están cargados como borrador. Revísalos y guarda las líneas.",
    "Genus lines saved, but the Genus capture could not be cleared:": "Las líneas de Genus se guardaron, pero no se pudo borrar la captura pendiente:",
    "Enter the actual Insight level before saving lines.": "Indica el nivel real de Insight antes de guardar las líneas.",
    "Level not recorded — enter it before saving": "Nivel no registrado — indícalo antes de guardar",
    "Capture Genus from screen": "Capturar Genus desde la pantalla",
    "Load reviewed capture": "Cargar captura revisada",
    "Opening the separate Genus capture window…": "Abriendo la ventana independiente de captura de Genus…",
    "Genus capture window is already open. Capture there, then review and save the lines here.": "La ventana de captura de Genus ya está abierta. Captura allí y luego revisa y guarda aquí las líneas.",
    "Genus capture window opened. Capture there, then review and save the lines here.": "Se abrió la ventana de captura de Genus. Captura allí y luego revisa y guarda aquí las líneas.",
    "Could not open Genus capture:": "No se pudo abrir la captura de Genus:",
    "View results": "Ver resultados",
    "INVENTORY ITEMS": "OBJETOS DEL INVENTARIO",
    "Best set from your inventory": "Mejor conjunto de tu inventario",
    "Goal gear": "Equipo objetivo",
    "Best": "Mejor",
    "Upgrade path": "Ruta de mejoras",
    "Step": "Paso",
    "Gain": "Ganancia",
    "Total": "Total",
    "Arcana": "Arcana",
    "Pantheon": "Panteón",
    "Your fights": "Tus combates",
    "Model calibration": "Calibración del modelo",
    "Simulated boss DPS as equipped:": "DPS simulado contra jefe con el equipo actual:",
    "Community calibration from your log server:": "Calibración comunitaria de tu servidor de registros:",
    "No saved fights for this character yet: record a boss fight with the live meter, or import AbyssLogs links on the Combat Logs page.": "Aún no hay combates guardados para este personaje. Registra un combate contra un jefe con el medidor en vivo o importa enlaces de AbyssLogs en «Registros de combate».",
    "Settings": "Ajustes",
    "Appearance": "Apariencia",
    "Overlay": "Superposición",
    "Meter": "Medidor",
    "Profiles & backup": "Perfiles y copia de seguridad",
    "App & data": "Aplicación y datos",
    "Theme": "Tema",
    "Follow computer": "Seguir el sistema",
    "Light": "Claro",
    "Dark": "Oscuro",
    "Accent colour": "Color de acento",
    "Recolours the app's accent on top of your light/dark theme.": "Cambia el color de acento de la aplicación sobre el tema claro u oscuro.",
    "Open as its own window": "Abrir en una ventana propia",
    "Collapse to tray": "Minimizar a la bandeja del sistema",
    "Your data": "Tus datos",
    "Open folder": "Abrir carpeta",
    "Public uploads are listed in the community logs and count in the rankings; unlisted ones open only with their link; private ones need the secret link": "Los registros públicos aparecen en la comunidad y cuentan en las clasificaciones; los no listados solo se abren con su enlace; los privados requieren el enlace secreto",
    "Save": "Guardar",
    "Check saved server": "Comprobar servidor guardado",
    "Community stats": "Estadísticas de la comunidad",
    "Live meter overlay": "Superposición del medidor en vivo",
    "Settings backup": "Copia de seguridad de ajustes",
    "Export settings": "Exportar ajustes",
    "Import settings": "Importar ajustes",
    "Save all overlay and app settings to a file you can restore or share, then import it back.": "Guarda los ajustes de la aplicación y la superposición en un archivo para restaurarlos o compartirlos.",
    "Build": "Configuración",
    "Saved results": "Resultados guardados",
    "optimized builds — copy each window into the game": "Configuraciones optimizadas: copia cada ventana al juego",
    "Refresh presets": "Actualizar configuraciones",
    "or optimize:": "o optimizar:",
    "PvP damage (experimental)": "Daño PvP (experimental)",
    "World PvP (experimental)": "PvP de mundo (experimental)",
    "Skill budget": "Puntos de habilidad",
    "Stigma budget": "Puntos de estigma",
    "Daevanion budget": "Puntos de Daevanion",
    "Optimize": "Optimizar",
    "Enter all three available point budgets (0–10000).": "Introduce los tres presupuestos de puntos disponibles (0–10000).",
    "Enter your available points explicitly.": "Introduce manualmente los puntos disponibles.",
    "Combat logs": "Registros de combate",
    "per-skill breakdown, timeline, rates, idle time — compared with your optimal rotation": "Desglose por habilidad, cronología, frecuencias y tiempo inactivo — comparados con tu rotación óptima",
    "Game database": "Base de datos del juego",
    "updates itself on every launch from the live sources — no code changes needed for new items, skills or classes": "Se actualiza al iniciar desde las fuentes disponibles; no hace falta cambiar el código para añadir objetos, habilidades o clases",
    "Live damage meter": "Medidor de daño en vivo",
    "built-in A2Tools packet capture, live analysis and a2log sharing": "Captura integrada de A2Tools, análisis en vivo y uso compartido de a2log",
    "Previous optimizations and advice, stored on this computer": "Optimizaciones y recomendaciones anteriores guardadas en este equipo",
    "Import previous result": "Importar resultado anterior",
    "Copy as text": "Copiar como texto",
    "My screenshot": "Mi captura",
    "remove": "quitar",
    "Copied to clipboard": "Copiado al portapapeles",
    "Copy failed": "No se pudo copiar",
    "Start": "Inicio",
    "Common": "Común",
    "Rare": "Raro",
    "Unknown": "Desconocido",
    "none": "ninguno",
    "loading": "cargando",
    "done": "listo",
    "working…": "procesando…",
    "Checking presets…": "Comprobando configuraciones…",
    "Showing saved presets or examples; server refresh unavailable.": "Se muestran configuraciones guardadas o ejemplos; no se pudo actualizar desde el servidor.",
    "Server budgets unavailable. Enter your available points explicitly.": "No se pudieron obtener los puntos del servidor. Introdúcelos manualmente.",
    "Recommended": "Recomendado",
    "Available": "Disponible",
    "Locked": "Bloqueado",
    "Skill points": "Puntos de habilidad",
    "Stigma points": "Puntos de estigma",
    "Points used": "Puntos usados",
    "Skill levels": "Niveles de habilidad",
    "Stats (all boards)": "Estadísticas (todos los tableros)",
    "No stigmas": "Sin estigmas",
    "No board data": "No hay datos del tablero",
    "Open in metabot planner": "Abrir en el planificador de MetaBot",
    "Accuracy": "Precisión",
    "Attack": "Ataque",
    "Critical Hit": "Golpe crítico",
    "Critical Damage": "Daño crítico",
    "Damage Boost": "Aumento de daño",
    "Weapon Damage Boost": "Aumento de daño de arma",
    "Combat Speed": "Velocidad de combate",
    "Cooldown Reduction": "Reducción de enfriamiento",
    "Double Chance": "Probabilidad de doble ataque",
    "Penetration": "Penetración",
    "Defense": "Defensa",
    "HP": "PV",
    "MP": "PM",
    "Settings →": "Ajustes →",
    "Quit": "Salir",
    "Stop the app": "Cerrar la aplicación",
    "Skip to content": "Saltar al contenido",
    "Join the aion2calc Discord": "Únete al Discord de aion2calc",
    "Theme: follow the computer": "Tema: seguir el sistema",
    "Equipment": "Equipamiento",
    "click a slot: what you wear → better from your inventory → next goal → best in slot": "Haz clic en una ranura: equipado → mejor de tu inventario → siguiente objetivo → mejor de la ranura",
    "empty": "vacío",
    "better item in your inventory": "objeto mejor en tu inventario",
    "next goal": "siguiente objetivo",
    "upgrade path step": "paso de la ruta de mejoras",
    "boss DPS": "DPS contra jefe",
    "Wearing": "Equipado",
    "From your inventory": "De tu inventario",
    "Next goal": "Siguiente objetivo",
    "Best in slot": "Mejor de la ranura",
    "Upgrade path steps for this slot:": "Pasos de mejora para esta ranura:",
    "one change at a time, biggest gain first, toward the next goals; a reroll names the stats to chase": "Una mejora a la vez, empezando por la mayor ganancia; los cambios de atributos indican qué buscar",
    "roll toward": "atributos deseados",
    "a roll worth chasing on this item": "atributo que vale la pena buscar en este objeto",
    "TARGET OPTIONS · UNIQUE +5": "OPCIONES OBJETIVO · ÚNICO +5",
    "ideal": "ideal",
    "average": "promedio",
    "YOURS": "TUS OBJETOS",
    "keep": "conservar",
    "replace": "reemplazar",
    "variant per slot, the skill options to chase (icons = target levels), and your arcana": "Variante por ranura, opciones de habilidad recomendadas (los iconos indican los niveles objetivo) y tu arcana",
    "MainHand": "Mano principal",
    "SubHand": "Mano secundaria",
    "Helmet": "Casco",
    "Shoulder": "Hombreras",
    "Torso": "Pecho",
    "Pants": "Pantalones",
    "Gloves": "Guantes",
    "Boots": "Botas",
    "Cape": "Capa",
    "Belt": "Cinturón",
    "Necklace": "Collar",
    "Earring1": "Pendiente 1",
    "Earring2": "Pendiente 2",
    "Ring1": "Anillo 1",
    "Ring2": "Anillo 2",
    "Bracelet1": "Brazalete 1",
    "Bracelet2": "Brazalete 2",
    "Amulet": "Amuleto",
    "Rune1": "Runa 1",
    "Rune2": "Runa 2",
    "next goal gain": "ganancia del siguiente objetivo",
    "NEXT GOAL": "SIGUIENTE OBJETIVO",
    "BEST IN SLOT": "MEJOR DE LA RANURA",
    "Upgrade": "Mejora",
    "enchant": "encantamiento",
    "reroll": "cambiar atributos",
    "item": "objeto",
    "Items": "Objetos",
    "all": "todos",
    "public": "público",
    "unlisted": "no listado",
    "private": "privado",
    "Saving…": "Guardando…",
    "Uploading…": "Subiendo…",
    "Removed.": "Eliminado.",
    "Could not read the file": "No se pudo leer el archivo",
    "Image must be 8 MB or smaller.": "La imagen debe ocupar 8 MB o menos.",
    "Image set. Set Visibility above 0 to show it.": "Imagen guardada. Ajusta la visibilidad para mostrarla.",
    "Application screenshot": "Captura de la aplicación",
    "Stop the app (version": "Cerrar la aplicación (versión",
    "No character profile was supplied.": "No se proporcionó un perfil de personaje.",
    "Character stats": "Estadísticas del personaje",
    "Equipment and inventory slots": "Equipo y ranuras del inventario",
    "Skills, passives and stigmas": "Habilidades, pasivas y estigmas",
    "Pet and wings": "Mascota y alas",
    "Daevanion boards": "Tableros de Daevanion",
    "Gear score (item level)": "Puntuación de equipo (nivel de objeto)",
    "Unknown class": "Clase desconocida",
    "Unknown server": "Servidor desconocido",
    "Unknown region": "Región desconocida",
    "Unnamed stat": "Estadística sin nombre",
    "Unavailable": "No disponible",
    "Stats were not included in this snapshot.": "Esta captura no incluye las estadísticas.",
    "Equipment was not included in this snapshot.": "Esta captura no incluye el equipo.",
    "Skills were not included in this snapshot.": "Esta captura no incluye las habilidades.",
    "Pet and wings were not included in this snapshot.": "Esta captura no incluye la mascota ni las alas.",
    "Boards were not included in this snapshot.": "Esta captura no incluye los tableros.",
    "Equipped": "Equipado",
    "Not equipped": "No equipado",
    "Equip state unavailable": "Estado de equipamiento no disponible",
    "Open": "Abierto",
    "Character portrait": "Retrato del personaje",
    "Image unavailable": "Imagen no disponible",
    "Source image unavailable": "Imagen de origen no disponible",
    "Your in-game screenshot": "Tu captura del juego",
    "No optimized builds yet — pick a class and press Optimize.": "Aún no hay configuraciones optimizadas. Elige una clase y pulsa «Optimizar».",
    "No arcana data": "No hay datos de arcana",
    "Totals": "Totales",
    "Deity & primary stats": "Deidad y estadísticas principales",
    "Titles, wings & pet": "Títulos, alas y mascota",
    "Wings": "Alas",
    "Pet": "Mascota",
    "Title": "Título",
    "Equip bonus": "Bonificación equipada",
    "Owned bonus": "Bonificación por posesión",
    "BEST TITLES FOR THIS BUILD": "MEJORES TÍTULOS PARA ESTA CONFIGURACIÓN",
    "Stats from equipped titles": "Estadísticas de los títulos equipados",
    "KEEP / REROLL TOWARD (best first)": "CONSERVAR / CAMBIAR POR (mejores primero)",
    "ENCHANT PRIORITY": "PRIORIDAD DE ENCANTAMIENTO",
    "RECOMMENDED VARIANT PER SLOT": "VARIANTE RECOMENDADA POR RANURA",
    "SKILL ROLLS — value of each arcana slot (Unique: 4 rolls at +0, 9 at +5)": "TIRADAS DE HABILIDAD — valor por ranura de arcana (Único: 4 tiradas en +0, 9 en +5)",
    "Best rolls (+1 / +2)": "Mejores tiradas (+1 / +2)",
    "Unique +0": "Único +0",
    "Unique +5": "Único +5",
    "Pet bonuses are mostly against one monster genus.": "Las bonificaciones de mascota suelen aplicarse contra un genus de monstruo.",
    "Optimize your build to generate its hotbar and macro setup.": "Optimiza tu configuración para generar la barra de habilidades y la configuración de macros.",
    "Aion 2 Calc": "Aion 2 Calc"
  };

  const originalText = new WeakMap();
  const renderedText = new WeakMap();
  const originalAttributes = new WeakMap();
  const renderedAttributes = new WeakMap();
  let language = "es";

  function storedLanguage() {
    try {
      return localStorage.getItem(STORAGE_KEY) === "en" ? "en" : "es";
    } catch (_) {
      return "es";
    }
  }

  function translated(value) {
    if (language !== "es") return value;
    const trimmed = value.trim();
    const result = Object.prototype.hasOwnProperty.call(es, trimmed) ? es[trimmed] : null;
    if (result === null) {
      const found = trimmed.match(/^(\d+) found$/);
      if (found) {
        const start = value.indexOf(trimmed);
        return value.slice(0, start) + `${found[1]} encontrados` + value.slice(start + trimmed.length);
      }
      const items = trimmed.match(/^database (\d+) items$/);
      if (items) {
        const start = value.indexOf(trimmed);
        return value.slice(0, start) + `base de datos: ${items[1]} objetos` + value.slice(start + trimmed.length);
      }
      return value;
    }
    const start = value.indexOf(trimmed);
    return value.slice(0, start) + result + value.slice(start + trimmed.length);
  }

  function ignored(node) {
    const parent = node.parentElement;
    return !parent || !!parent.closest("script,style,code,pre,textarea,[data-no-translate],[data-language-label],.gname,.nm,.skill-title,.class-name");
  }

  function translateText(node) {
    if (ignored(node)) return;
    let source = originalText.get(node);
    if (source === undefined || renderedText.has(node) && node.nodeValue !== renderedText.get(node)) {
      source = node.nodeValue;
      originalText.set(node, source);
    }
    const value = translated(source);
    if (node.nodeValue !== value) node.nodeValue = value;
    renderedText.set(node, value);
  }

  function translateAttribute(element, name) {
    let attrs = originalAttributes.get(element);
    if (!attrs) {
      attrs = {};
      originalAttributes.set(element, attrs);
    }
    let rendered = renderedAttributes.get(element);
    if (!rendered) {
      rendered = {};
      renderedAttributes.set(element, rendered);
    }
    const current = element.getAttribute(name);
    if (current === null) return;
    if (!(name in attrs) || name in rendered && current !== rendered[name]) attrs[name] = current;
    const value = translated(attrs[name]);
    if (current !== value) element.setAttribute(name, value);
    rendered[name] = value;
  }

  function translateTree(root) {
    if (!root) return;
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const texts = [];
    while (walker.nextNode()) texts.push(walker.currentNode);
    texts.forEach(translateText);
    const elements = root.nodeType === Node.ELEMENT_NODE ? [root, ...root.querySelectorAll("*")] : root.querySelectorAll ? [...root.querySelectorAll("*")] : [];
    elements.forEach((element) => ["title", "placeholder", "aria-label", "alt"].forEach((name) => translateAttribute(element, name)));
  }

  function setLanguage(value) {
    language = value === "en" ? "en" : "es";
    try {
      localStorage.setItem(STORAGE_KEY, language);
    } catch (_) {}
    document.documentElement.lang = language;
    document.querySelectorAll("#language-select, #language-setting").forEach((select) => { select.value = language; });
    document.querySelectorAll("[data-language-label]").forEach((label) => {
      label.textContent = language === "es" ? "Idioma" : "Language";
    });
    translateTree(document.body);
  }

  document.addEventListener("change", (event) => {
    if (event.target?.id === "language-select" || event.target?.id === "language-setting") setLanguage(event.target.value);
  });

  const observer = new MutationObserver((records) => {
    for (const record of records) {
      if (record.type === "characterData") translateText(record.target);
      else if (record.type === "attributes") translateAttribute(record.target, record.attributeName);
      else record.addedNodes.forEach((node) => {
        if (node.nodeType === Node.TEXT_NODE) translateText(node);
        else if (node.nodeType === Node.ELEMENT_NODE) translateTree(node);
      });
    }
  });

  language = storedLanguage();
  observer.observe(document.body, { subtree: true, childList: true, characterData: true, attributes: true,
    attributeFilter: ["title", "placeholder", "aria-label", "alt"] });
  setLanguage(language);
  window.A2I18n = { language: () => language, setLanguage };
})();
