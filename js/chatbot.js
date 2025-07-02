// chatbot.js - Lógica para el asistente de YoungMind (Versión Mejorada)

document.addEventListener('DOMContentLoaded', () => {
    const chatWidget = document.getElementById('chatbot-widget');
    const chatToggle = document.getElementById('chatbot-toggle');
    const chatClose = document.getElementById('chatbot-close');
    const chatBody = document.getElementById('chatbot-body');
    const chatInput = document.getElementById('chatbot-input');
    const chatSend = document.getElementById('chatbot-send');

    // Variable para manejar conversaciones simples
    let context = null;

    // Base de conocimiento más robusta con palabras clave y contexto
    const knowledgeBase = {
        'saludo': {
            keywords: ['hola', 'buenas', 'hey', 'hello', 'saludos'],
            response: "¡Hola! Soy el asistente virtual de YoungMind. ¿En qué puedo ayudarte? Puedes preguntarme sobre nuestros servicios, fundadores, misión, etc."
        },
        'despedida': {
            keywords: ['adios', 'chao', 'hasta luego', 'bye'],
            response: "¡Hasta luego! Si tienes más dudas, aquí estaré. ¡Que tengas un gran día!"
        },
        'gracias': {
            keywords: ['gracias', 'te pasaste', 'muchas gracias', 'agradezco'],
            response: "¡De nada! Es un placer ayudarte. ¿Hay algo más en lo que pueda asistirte?"
        },
        'servicios_general': {
            keywords: ['servicios', 'ofrecéis', 'hacéis', 'productos', 'soluciones'],
            response: "Ofrecemos una gama completa de soluciones de IA: Agentes de IA Personalizados, Bots Conversacionales, Automatización de Workflows, Consultoría Estratégica, Análisis de Datos e Integración de APIs. ¿Quieres que te detalle alguno en concreto?",
            context: 'awaiting_service_choice' // Prepara al bot para la siguiente pregunta
        },
        'agentes_ia': {
            keywords: ['agentes', 'asistentes inteligentes', 'agentes de ia'],
            response: "Desarrollamos asistentes inteligentes y autónomos que entienden, procesan y automatizan tareas específicas de tu negocio, desde la gestión de datos hasta la toma de decisiones complejas."
        },
        'bots': {
            keywords: ['bots', 'chatbots', 'bots conversacionales', 'whatsapp'],
            response: "Implementamos chatbots avanzados para WhatsApp, tu sitio web y más. Mejoran la experiencia del usuario, resuelven consultas frecuentes y derivan casos complejos a agentes humanos 24/7."
        },
        'automatizacion': {
            keywords: ['automatización', 'automatizar', 'workflows', 'procesos', 'n8n', 'zapier'],
            response: "Optimizamos tus flujos de trabajo con herramientas como n8n y Zapier o con soluciones a medida. Conectamos tus herramientas para crear flujos de trabajo eficientes, garantizando escalabilidad y reduciendo costes."
        },
        'consultoria': {
            keywords: ['consultoría', 'consultoria', 'estrategia', 'estratégica'],
            response: "Analizamos tus procesos, identificamos oportunidades con IA y diseñamos una hoja de ruta estratégica para tu empresa. Te guiamos en la selección de tecnologías, implementación y optimización."
        },
        'analisis_datos': {
            keywords: ['datos', 'análisis', 'analisis', 'business intelligence'],
            response: "Transformamos grandes volúmenes de datos en insights accionables. Creamos dashboards interactivos y reportes automatizados que te permiten visualizar tendencias y medir el rendimiento."
        },
        'integracion_apis': {
            keywords: ['integración', 'integracion', 'apis', 'sistemas'],
            response: "Facilitamos la comunicación entre tus diferentes aplicaciones y plataformas, creando ecosistemas digitales unificados y eficientes, esenciales para la automatización."
        },
        'fundadores': {
            keywords: ['fundadores', 'quienes sois', 'quiénes sois', 'equipo', 'youngmind'],
            response: "YoungMind fue fundada en A Coruña por Adrián Álvarez Sande y Pablo Rodríguez Andújar, dos jóvenes apasionados por la tecnología y la IA."
        },
        'adrian': {
            keywords: ['adrián', 'adrian', 'álvarez', 'alvarez sande'],
            response: "Adrián Álvarez Sande es Co-Fundador y Estratega de IA. Estudia Ciencias de la Computación y Economía en la Vrije Universiteit Amsterdam y aporta la visión estratégica y la arquitectura de soluciones."
        },
        'pablo': {
            keywords: ['pablo', 'rodríguez', 'rodriguez andujar'],
            response: "Pablo Rodríguez Andújar es Co-Fundador y Data Scientist. Estudia Ciencia de Datos e Inteligencia Artificial en CUNEF, Madrid, y es nuestro experto en transformar datos en inteligencia para potenciar los modelos de IA."
        },
        'mision': {
            keywords: ['misión', 'mision', 'objetivo'],
            response: "Nuestra misión es facilitar el acceso a tecnologías de IA de vanguardia para empresas de todos los tamaños, optimizando sus procesos, reduciendo costes y fomentando la innovación continua."
        },
        'vision': {
            keywords: ['visión', 'vision', 'meta'],
            response: "Nuestra visión es consolidarnos como la agencia de IA referente, siendo reconocidos por nuestra excelencia técnica, capacidad de innovación y nuestro compromiso con el éxito de nuestros clientes."
        },
        'ubicacion': {
            keywords: ['ubicación', 'donde estais', 'dónde estáis', 'sede'],
            response: "Nuestra sede está en A Coruña, Galicia (España), pero ofrecemos nuestros servicios a clientes de todo el mundo."
        },
        'contacto': {
            keywords: ['contacto', 'contactar', 'email', 'teléfono', 'demo', 'reunion'],
            response: "Puedes contactarnos rellenando el formulario en la web, escribiéndonos a info@youngmind.ai o agendando una demo gratuita desde nuestra página de inicio. ¡Estaremos encantados de hablar contigo!"
        }
    };

    function toggleChatbot() {
        chatWidget.classList.toggle('hidden');
        if (!chatWidget.classList.contains('hidden')) {
            if (chatBody.children.length === 0) {
                addBotMessage("¡Hola! Soy el asistente de YoungMind. Pregúntame lo que quieras sobre nuestros servicios, fundadores o cómo podemos ayudarte.");
            }
            chatInput.focus();
        }
    }

    function sendMessage() {
        const userInput = chatInput.value.trim();
        if (userInput === '') return;
        addUserMessage(userInput);
        chatInput.value = '';
        setTimeout(() => getBotResponse(userInput), 500);
    }

    function addUserMessage(message) {
        const messageElement = document.createElement('div');
        messageElement.className = 'chatbot-message user-message';
        messageElement.textContent = message;
        chatBody.appendChild(messageElement);
        scrollToBottom();
    }

    function addBotMessage(message, isTyping = false) {
        const messageElement = document.createElement('div');
        messageElement.className = 'chatbot-message bot-message';
        if (isTyping) {
            messageElement.innerHTML = `<div class="typing-indicator"><span></span><span></span><span></span></div>`;
            messageElement.id = 'typing-indicator';
        } else {
            messageElement.textContent = message;
        }
        chatBody.appendChild(messageElement);
        scrollToBottom();
    }

    function getBotResponse(userInput) {
        addBotMessage('', true); // Muestra el indicador de "escribiendo"

        setTimeout(() => {
            const typingIndicator = document.getElementById('typing-indicator');
            if (typingIndicator) typingIndicator.remove();

            const lowerCaseInput = userInput.toLowerCase();
            let foundResponse = null;

            // Primero, verificar si hay un contexto activo (p.ej. esperando detalle de servicio)
            if (context === 'awaiting_service_choice') {
                for (const key in knowledgeBase) {
                    // Buscar solo en las entradas de servicios específicos
                    if (['agentes_ia', 'bots', 'automatizacion', 'consultoria', 'analisis_datos', 'integracion_apis'].includes(key)) {
                        if (knowledgeBase[key].keywords.some(k => lowerCaseInput.includes(k))) {
                            foundResponse = knowledgeBase[key].response;
                            break;
                        }
                    }
                }
                context = null; // Resetear contexto después de responder
            }

            // Si no se encontró respuesta en el contexto, buscar en toda la base de conocimiento
            if (!foundResponse) {
                for (const key in knowledgeBase) {
                    if (knowledgeBase[key].keywords.some(k => lowerCaseInput.includes(k))) {
                        foundResponse = knowledgeBase[key].response;
                        if (knowledgeBase[key].context) {
                            context = knowledgeBase[key].context;
                        }
                        break;
                    }
                }
            }
            
            // Si no se encuentra ninguna respuesta, usar la respuesta por defecto
            if (foundResponse) {
                addBotMessage(foundResponse);
            } else {
                addBotMessage("No he entendido bien tu pregunta. Puedes probar a preguntarme sobre: 'servicios', 'fundadores', 'misión', 'contacto' o 'pedir una demo'.");
            }

        }, 1200); // Simular tiempo de "pensamiento"
    }

    function scrollToBottom() {
        chatBody.scrollTop = chatBody.scrollHeight;
    }

    // --- Event Listeners ---
    chatToggle.addEventListener('click', toggleChatbot);
    chatClose.addEventListener('click', toggleChatbot);
    chatSend.addEventListener('click', sendMessage);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });
});