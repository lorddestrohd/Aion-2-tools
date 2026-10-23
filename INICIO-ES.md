# Recomendador PvE de AION 2 — Asesino

Este proyecto usa **Aion 2 Calc** (GPL-3.0) como motor. La app local incluye importación de personajes, comparación de equipo y la sección **Gear & Advice**, que simula cambios de equipo para ordenar mejoras por DPS en lugar de aplicar pesos lineales fijos. La importación consulta la armería pública de NCSOFT y, por cada pieza equipada, solicita sus stats, substats, piedras de maná, piedra sagrada y opciones de habilidad disponibles.

## Preparación

Requisitos: Windows y Python 3.10 o posterior.

Desde PowerShell, en esta carpeta:

```powershell
python -m pip install -e ".[genus-ocr]"
.\iniciar-recomendador.ps1
```

La app se abre en el navegador en `http://127.0.0.1:8765` y comienza en español. La pantalla de inicio muestra el flujo recomendado: importar el personaje, revisar el equipo y optimizar la configuración. También puedes abrir las páginas desde los menús agrupados **Personaje y configuraciones**, **Combate** y **Herramientas del juego**. Usa el selector **Idioma / Language** de la barra superior (o **Ajustes → Apariencia → Idioma**) para cambiar entre español e inglés; la elección se recuerda en ese navegador. Selecciona **Importar personaje** para buscar e importar el personaje de la región Global; después abre **Equipo y recomendaciones** para ver el equipo actual, los cambios recomendados por pieza y las mejoras objetivo. Los datos de la bolsa/almacén que no aparezcan en la armería se agregan manualmente desde esa página.

## Probar la versión de desarrollo con un amigo

Para probar la búsqueda pegando un enlace de perfil de MetaBot, tu amigo necesita Windows, Git y Python 3.10 o posterior. Debe abrir PowerShell y ejecutar estos comandos, uno por uno:

```powershell
git clone --branch genus-ocr-save https://github.com/lorddestrohd/Aion-2-tools.git
cd Aion-2-tools
python -m pip install -e .
python -m aion2calc app --no-sync
```

Luego debe abrir `http://127.0.0.1:8765`, ir a **Mi personaje**, pegar un enlace como `https://metabot.gg/es_ES/aion-2/profile/nae/marchutan/LordD` y pulsar **Buscar**. La app usa el enlace para identificar región, servidor y nombre, y busca la coincidencia en el servicio oficial de perfiles de AION 2. Al pulsar **Importar**, consulta el perfil y el equipo en ese servicio oficial; no depende de una API privada de MetaBot.

`--no-sync` evita la sincronización de datos al iniciar la app. La búsqueda e importación sí necesitan conexión a Internet. Para probar OCR de Genus desde la pantalla, en cambio, se instalan las dependencias opcionales con `python -m pip install -e ".[genus-ocr]"`. La app corre localmente en el equipo de cada persona; esta dirección no la publica en Internet ni comparte automáticamente sus datos locales.

## Leer Genus desde el overlay

La instalación incluye el lector local de pantalla para Windows. Windows debe tener instalado al menos un paquete de reconocimiento OCR en inglés o español; puedes elegir el idioma dentro de la ventana de captura.

1. Abre AION 2 y muestra **Pets → Genus Insight**, con el panel de efectos a la derecha. Deja el juego visible y no minimizado.
2. En la aplicación, abre **Equipo y recomendaciones → Introspección de Genus** y pulsa **Capturar Genus desde la pantalla**. Se abrirá una ventana independiente; ya no está dentro del overlay de combate.
3. En esa ventana, pulsa **Capturar y leer**. Revisa el genus, el nivel y cada ranura; corrige campos vacíos o dudosos y pulsa **Enviar al editor de Genus**.
4. Vuelve a **Equipo y recomendaciones**: los datos aparecerán como borrador. Revísalos y pulsa **Guardar líneas de Genus** para guardarlos en la configuración del personaje. La captura se conserva pendiente hasta que el guardado se completa.

El OCR corre localmente. No se captura de forma continua ni se guarda la imagen; la captura revisada queda temporalmente en la memoria de la app y caduca a los 30 minutos. Si el lector no puede reconocer un nombre, deja el campo para que lo corrijas antes de enviar. La captura sirve para rellenar datos, no para guardar automáticamente sin revisión.

## Privacidad y datos

- El perfil y las búsquedas se consultan solo cuando eliges importar; el nombre y los identificadores del personaje se envían a la armería pública de NCSOFT.
- Los datos locales de esta instalación se guardan en `.aion2calc-local/`, excluida de Git.
- El iniciador crea una configuración local que desactiva el envío de progresión a la comunidad, los latidos de presencia, el inicio automático del medidor y la carga automática de registros. La configuración se crea solo la primera vez; si cambias esos ajustes en la app, se conservan.
- La sincronización de inicio puede descargar datos públicos del juego desde fuentes comunitarias documentadas para mantener actualizado el catálogo. No se usa una API privada de terceros para completar tu equipo.
- La página de MetaBot que compartiste sirve como comprobación visual independiente; no hace falta rasparla para importar las piezas. El inventario y el almacén no son parte del perfil público, así que se agregan manualmente si quieres que entren en la comparación.

## Cómo interpretar las recomendaciones

El resultado es una **simulación PvE**, no una garantía de mejor build ni una clasificación del meta. La precisión depende de los datos Global disponibles, del parche y de las mecánicas modeladas. Revisa la sección de calibración del informe: puede combinar el modelo general de la comunidad con combates tuyos si los importas; no confundas una calibración comunitaria con una calibración personal. Confirma dentro del juego cualquier stat que la importación marque como faltante. La búsqueda y los datos de Global pueden cambiar si NCSOFT modifica su armería.

Para mantener el motor y sus obligaciones de licencia, consulta [LICENSE](./LICENSE) (GPL-3.0) y la metodología de upstream en [docs/methodology.md](./docs/methodology.md).
