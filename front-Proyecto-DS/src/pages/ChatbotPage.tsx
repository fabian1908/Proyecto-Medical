import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

// --- CONFIGURACIÓN --- (Mantenemos la misma configuración)
const API_KEY = 'AIzaSyCPvCYaBo4t3G3t6BvBId5fN-LAHzWzmh0';
const MODEL_NAME = 'gemini-1.5-flash-latest';
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${API_KEY}`;

const ChatbotPage = () => {
    const [history, setHistory] = useState<{ sender: 'user' | 'bot', text: string, imageUrl?: string }[]>([
        { sender: 'bot', text: 'Hola. Describe tus síntomas o sube una imagen médica para que pueda ayudarte a identificar una especialidad.' }
    ]);
    const [userInput, setUserInput] = useState('');
    const [stagedImage, setStagedImage] = useState<{ base64: string, mimeType: string } | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [especialidad, setEspecialidad] = useState<string | null>(null);
    const navigate = useNavigate();
    const chatHistoryEl = useRef<HTMLDivElement>(null);
    const imageInputEl = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (chatHistoryEl.current) {
            chatHistoryEl.current.scrollTop = chatHistoryEl.current.scrollHeight;
        }
    }, [history]);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setStagedImage({
                    base64: (event.target?.result as string).split(',')[1],
                    mimeType: file.type
                });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!userInput && !stagedImage) return;

        const userMessage = { sender: 'user' as const, text: userInput, imageUrl: stagedImage ? `data:${stagedImage.mimeType};base64,${stagedImage.base64}` : undefined };
        setHistory(prev => [...prev, userMessage]);
        setUserInput('');
        setStagedImage(null);
        setIsLoading(true);

        try {
            const systemInstructionText = `Eres un asistente médico amigable y conversador. Tu objetivo es ayudar al usuario a identificar una posible especialidad médica y responder a sus preguntas de salud de manera general. Si puedes identificar una especialidad, inclúyela en el JSON. Si no, responde a la pregunta de la mejor manera posible. DEBES responder con un único objeto JSON válido. El JSON debe tener dos claves: "chatResponse" (tu respuesta conversacional y útil en español) y "especialidad" (un string con la especialidad médica en español, o null si no es relevante o no se puede determinar).`;
            const userQueryParts = [{ text: `Texto del usuario: "${userInput}".` }];
            if (stagedImage) {
                userQueryParts.push({ inline_data: { mime_type: stagedImage.mimeType, data: stagedImage.base64 } } as any);
            }
            
            const contents = [{ role: "user", parts: userQueryParts }];

            const response = await fetch(GEMINI_API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ contents, generationConfig: { responseMimeType: "application/json" } })
            });

            if (!response.ok) throw new Error('Error en la respuesta de la API');

            const data = await response.json();
            const responseObject = JSON.parse(data.candidates[0].content.parts[0].text);

            if (responseObject.chatResponse && responseObject.hasOwnProperty('especialidad')) {
                setHistory(prev => [...prev, { sender: 'bot', text: responseObject.chatResponse }]);
                setEspecialidad(responseObject.especialidad);
            } else {
                throw new Error("La respuesta de la IA no tiene el formato JSON esperado.");
            }

        } catch (error) {
            console.error("Error al llamar a Gemini:", error);
            setHistory(prev => [...prev, { sender: 'bot', text: `Error: No se pudo obtener una respuesta. Revisa la consola.` }]);
        } finally {
            setIsLoading(false);
        }
    };
    
    const confirmSpecialty = () => {
        if (especialidad) {
            localStorage.setItem('selectedSpecialty', especialidad);
            navigate('/');
        }
    };

    return (
        <div className="container-fluid mt-4" style={{ height: 'calc(100vh - 70px)', display: 'flex' }}>
            <div className="card w-100">
                <div className="card-header text-center">
                    <h3>Asistente de Especialidad Médica</h3>
                </div>
                <div className="card-body d-flex">
                    <div className="flex-grow-1 d-flex flex-column p-3">
                        <div ref={chatHistoryEl} className="flex-grow-1 overflow-auto mb-3 p-2 bg-light rounded">
                            {history.map((msg, index) => (
                                <div key={index} className={`d-flex ${msg.sender === 'user' ? 'justify-content-end' : 'justify-content-start'} mb-2`}>
                                    <div className={`p-3 rounded ${msg.sender === 'user' ? 'bg-primary text-white' : 'bg-secondary text-white'}`} style={{ maxWidth: '70%' }}>
                                        {msg.imageUrl && <img src={msg.imageUrl} alt="preview" className="img-fluid rounded mb-2" />}
                                        <p className="mb-0">{msg.text}</p>
                                    </div>
                                </div>
                            ))}
                            {isLoading && <div className="d-flex justify-content-start mb-2"><div className="p-3 rounded bg-secondary text-white">Analizando...</div></div>}
                        </div>
                        <form onSubmit={handleSubmit} className="d-flex">
                            <button type="button" className="btn btn-secondary me-2" onClick={() => imageInputEl.current?.click()}>Adjuntar</button>
                            <input type="file" ref={imageInputEl} onChange={handleImageUpload} className="d-none" accept="image/*" />
                            <input type="text" className="form-control me-2" value={userInput} onChange={(e) => setUserInput(e.target.value)} placeholder="Escribe tus síntomas..." disabled={isLoading} />
                            <button type="submit" className="btn btn-primary" disabled={isLoading}>Enviar</button>
                        </form>
                    </div>
                    <div className="p-3" style={{ minWidth: '300px', borderLeft: '1px solid #ccc' }}>
                        <h4>Especialidad Identificada</h4>
                        <pre className="bg-dark text-white p-3 rounded h-50">{JSON.stringify({ especialidad }, null, 2)}</pre>
                        <button className="btn btn-success w-100 mt-3" onClick={confirmSpecialty} disabled={!especialidad || isLoading}>
                            Confirmar y Ver Doctores
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChatbotPage;