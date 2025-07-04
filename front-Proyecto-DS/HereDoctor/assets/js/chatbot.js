// --- CONFIGURACIÓN ---
const API_KEY = 'AIzaSyCPvCYaBo4t3G3t6BvBId5fN-LAHzWzmh0';
const MODEL_NAME = 'gemini-1.5-flash-latest';
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${API_KEY}`;

// --- REFERENCIAS AL DOM ---
const chatHistoryEl = document.getElementById('chat-history');
const chatForm = document.getElementById('chat-form');
const userInputEl = document.getElementById('user-input');
const imageInputEl = document.getElementById('image-input');
const imageUploadButton = document.getElementById('image-upload-button');
const imagePreviewContainer = document.getElementById('image-preview-container');
const imagePreviewEl = document.getElementById('image-preview');
const removeImageBtn = document.getElementById('remove-image-btn');
const submitButton = document.getElementById('submit-button');
const jsonOutputEl = document.getElementById('json-output');
const confirmSpecialtyBtn = document.getElementById('confirm-specialty-btn');

// --- ESTADO DE LA APLICACIÓN ---
let conversationHistory = [];
let especialidadState = null;
let stagedImage = null; // { base64: string, mimeType: string }

// --- LÓGICA PRINCIPAL ---

function renderEspecialidad() {
    const output = {
        especialidad: especialidadState
    };
    jsonOutputEl.textContent = JSON.stringify(output, null, 2);

    // Habilitar/deshabilitar el botón de confirmación
    if (especialidadState) {
        confirmSpecialtyBtn.disabled = false;
    } else {
        confirmSpecialtyBtn.disabled = true;
    }
}

function addMessage(sender, text, imageUrl = null) {
    const messageContainer = document.createElement('div');
    messageContainer.className = `w-full flex ${sender === 'user' ? 'justify-end' : 'justify-start'}`;
    const messageElement = document.createElement('div');
    messageElement.className = `chat-bubble ${sender}`;

    if (imageUrl) {
        const img = document.createElement('img');
        img.src = imageUrl;
        img.className = 'rounded-lg mb-2 max-h-48 w-full object-contain';
        messageElement.appendChild(img);
    }
    if (text) {
        const p = document.createElement('p');
        p.textContent = text;
        messageElement.appendChild(p);
    }

    messageContainer.appendChild(messageElement);
    chatHistoryEl.appendChild(messageContainer);
    chatHistoryEl.scrollTop = chatHistoryEl.scrollHeight;
    return messageElement;
}

chatForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const userText = userInputEl.value.trim();

    if (!userText && !stagedImage) {
        return;
    }
    
    const imageToSend = stagedImage;
    const imageUrlForUi = imageToSend ? `data:${imageToSend.mimeType};base64,${imageToSend.base64}` : null;
    addMessage('user', userText, imageUrlForUi);

    userInputEl.value = '';
    resetImageSelection();
    toggleForm(false);
    const thinkingBubble = addMessage('bot', 'Analizando...');
    thinkingBubble.classList.add('thinking-bubble');

    try {
        // Instrucción del sistema simplificada para el nuevo formato JSON
        const systemInstructionText = `Eres un experto analista médico. Tu objetivo es identificar la especialidad médica relevante basándote en la conversación y/o una imagen. DEBES responder con un único objeto JSON válido. El JSON debe tener dos claves: "chatResponse" (tu respuesta conversacional en español) y "especialidad" (un string con la especialidad médica en español, o null si no se puede determinar).`;

        const userQueryParts = [];
        
        let combinedUserText = `Texto del usuario: "${userText}".`;
        if (conversationHistory.length === 0) {
            combinedUserText = `${systemInstructionText}\n\n---\n\n${combinedUserText}`;
        }
        userQueryParts.push({ text: combinedUserText });

        if (imageToSend) {
            userQueryParts.push({
                inline_data: {
                    mime_type: imageToSend.mimeType,
                    data: imageToSend.base64
                }
            });
        }
        
        const contents = [...conversationHistory, { role: "user", parts: userQueryParts }];

        const response = await fetch(GEMINI_API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents, generationConfig: { responseMimeType: "application/json" } })
        });

        if (!response.ok) {
            const errorBody = await response.json();
            throw new Error(errorBody.error.message);
        }

        const data = await response.json();
        const responseText = data.candidates[0].content.parts[0].text;
        const responseObject = JSON.parse(responseText);

        thinkingBubble.remove();
        
        if (responseObject.chatResponse && responseObject.hasOwnProperty('especialidad')) {
            addMessage('bot', responseObject.chatResponse);
            especialidadState = responseObject.especialidad;
            renderEspecialidad();
            
            conversationHistory.push(
                { role: "user", parts: userQueryParts },
                { role: "model", parts: [{ text: JSON.stringify(responseObject) }] }
            );
        } else {
             throw new Error("La respuesta de la IA no tiene el formato JSON esperado.");
        }

    } catch (error) {
        console.error("Error al llamar a Gemini:", error);
        thinkingBubble.textContent = `Error: ${error.message}. Por favor, revisa la consola y tu clave de API.`;
        thinkingBubble.classList.remove('thinking-bubble');
    } finally {
        toggleForm(true);
    }
});

function toggleForm(enabled) {
    userInputEl.disabled = !enabled;
    submitButton.disabled = !enabled;
    imageUploadButton.disabled = !enabled;
}

function resetImageSelection() {
    imageInputEl.value = '';
    imagePreviewContainer.classList.add('hidden');
    stagedImage = null;
}

imageUploadButton.addEventListener('click', () => imageInputEl.click());
removeImageBtn.addEventListener('click', resetImageSelection);

imageInputEl.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
            imagePreviewEl.src = event.target.result;
            imagePreviewContainer.classList.remove('hidden');
            stagedImage = {
                base64: event.target.result.split(',')[1],
                mimeType: file.type
            };
        };
        reader.readAsDataURL(file);
    }
});

confirmSpecialtyBtn.addEventListener('click', () => {
    if (especialidadState) {
        // Guardar la especialidad en localStorage para usarla en otra página
        localStorage.setItem('selectedSpecialty', especialidadState);
        // Redirigir a la página de inicio/doctores
        window.location.href = 'starter-page.html';
    }
});

// Renderizado inicial
renderEspecialidad();
