const { useState, useEffect, useMemo } = React;

// --- Firebase Configuration ---
const firebaseConfig = {
    apiKey: "AIzaSyC9o4xQJyATIrwx4T-iK-Qdud0JfcmJRak",
    authDomain: "viajando-x-el-mundo-e8ea2.firebaseapp.com",
    databaseURL: "https://viajando-x-el-mundo-e8ea2-default-rtdb.firebaseio.com",
    projectId: "viajando-x-el-mundo-e8ea2",
    storageBucket: "viajando-x-el-mundo-e8ea2.firebasestorage.app",
    messagingSenderId: "861380500997",
    appId: "1:861380500997:web:ae38bf554b9060ed4b866c",
    measurementId: "G-PJZK6TJ36H"
};

// Initialize Firebase (Check if already initialized for HMR)
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const db = firebase.database();

// --- Components ---

const Header = () => (
    <header className="p-6 flex justify-between items-center relative z-10">
        <div className="flex flex-col">
            <div className="flex items-baseline gap-2 -mb-2">
                <span className="font-viajando text-3xl text-cyan">Viajando</span>
                <span className="font-viajando text-xl text-gold">por</span>
            </div>
            <span className="font-mundo text-4xl text-white">EL MUNDO</span>
        </div>
        <div className="hidden md:flex gap-6 text-sm font-semibold tracking-widest text-cyan/60">
            <span>AVENTURA</span>
            <span>LUJO</span>
            <span>DESTINOS</span>
        </div>
    </header>
);

const Hero = ({ draw }) => {
    const [timeLeft, setTimeLeft] = useState({ d: 0, h: 0, m: 0, s: 0 });

    useEffect(() => {
        if (!draw.date) return;
        const timer = setInterval(() => {
            const now = new Date().getTime();
            const distance = new Date(draw.date).getTime() - now;
            if (distance < 0) {
                clearInterval(timer);
                return;
            }
            setTimeLeft({
                d: Math.floor(distance / (1000 * 60 * 60 * 24)),
                h: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                m: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
                s: Math.floor((distance % (1000 * 60)) / 1000)
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [draw.date]);

    return (
        <section className="px-6 py-12 text-center relative z-10 max-w-4xl mx-auto">
            <div className="mb-4 inline-block px-4 py-1 rounded-full border border-cyan/30 bg-cyan/10 text-cyan text-xs tracking-widest">
                PRÓXIMO DESTINO
            </div>
            <h1 className="text-6xl md:text-8xl font-mundo neon-title mb-6 animate-pulse">
                {draw.destination || "CARGANDO..."}
            </h1>
            <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
                {draw.description || "Prepárate para la aventura de tu vida."}
            </p>
            
            <div className="flex justify-center gap-4 mb-10">
                {['d', 'h', 'm', 's'].map(unit => (
                    <div key={unit} className="w-20 h-24 bg-navy/80 border border-white/10 rounded-xl flex flex-col items-center justify-center">
                        <span className="text-3xl font-mundo text-gold">{timeLeft[unit]}</span>
                        <span className="text-[10px] text-white/40 uppercase tracking-tighter">{unit === 'd' ? 'Días' : unit === 'h' ? 'Hrs' : unit === 'm' ? 'Min' : 'Seg'}</span>
                    </div>
                ))}
            </div>

            <div className="max-w-md mx-auto mb-8">
                <div className="flex justify-between text-xs mb-2 text-white/60">
                    <span>{draw.soldCount || 0} de 100 vendidos</span>
                    <span>{(draw.soldCount || 0)}% vendido</span>
                </div>
                <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                    <div 
                        className="h-full bg-gradient-to-r from-cyan to-gold transition-all duration-1000"
                        style={{ width: `${draw.soldCount || 0}%` }}
                    />
                </div>
            </div>

            <button 
                onClick={() => document.getElementById('grid-section').scrollIntoView({ behavior: 'smooth' })}
                className="pulse bg-gold text-navy font-mundo px-10 py-4 rounded-full hover:scale-105 transition-transform"
            >
                ¡QUIERO MI AVIÓN!
            </button>
        </section>
    );
};

const Grid = ({ tickets, selectedTickets, onSelect }) => {
    const availableCount = Array.from({ length: 100 }).filter(
        (_, i) => (tickets[i.toString().padStart(2, '0')] || 'available') === 'available'
    ).length;

    return (
        <section id="grid-section" className="px-6 py-20 bg-navy/40 backdrop-blur-md border-y border-white/5">
            <div className="max-w-5xl mx-auto text-center">
                <h2 className="text-4xl font-mundo mb-2 italic">La Pista de Despegue</h2>
                <p className="text-gold mb-2 italic">Más aviones = más probabilidades de ganar ✈️</p>
                
                {availableCount < 20 && (
                    <p className={`text-red-500 font-bold mb-4 animate-pulse uppercase tracking-widest text-sm`}>
                        ⚡ ¡Solo quedan {availableCount} aviones!
                    </p>
                )}

                <div className="bg-navy/60 p-4 rounded-lg mb-10 border border-cyan/20 inline-block text-sm text-cyan/80">
                    <p>Cada número representa las dos últimas cifras del número ganador de la Lotería de Medellín.</p>
                </div>

                <div className={`ticket-grid ${availableCount < 10 ? 'animate-vibrate' : ''}`}>
                    {Array.from({ length: 100 }).map((_, i) => {
                        const num = i.toString().padStart(2, '0');
                        const status = tickets[num] || 'available';
                        const isSelected = selectedTickets.includes(num);
                        
                        let displayChar = num;
                        let statusClass = '';
                        if (status === 'reserved') { displayChar = '🔒'; statusClass = 'reserved'; }
                        if (status === 'confirmed') { displayChar = '✈️'; statusClass = 'confirmed'; }
                        if (status === 'taken') { displayChar = '🔒'; statusClass = 'taken'; } // Backwards compatibility
                        
                        return (
                            <div 
                                key={num}
                                className={`ticket-slot ${statusClass} ${isSelected ? 'selected' : ''}`}
                                onClick={() => status === 'available' && onSelect(num)}
                                title={status === 'available' ? 'Haz clic para reservar' : `Estado: ${status}`}
                            >
                                {isSelected ? '✓' : displayChar}
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

const SidebarPanel = ({ selectedTickets, price, onReserve }) => {
    if (selectedTickets.length === 0) return null;

    const total = selectedTickets.length * price;
    const prob = selectedTickets.length;

    let motivation = "¡Buen comienzo! Agrega más 🚀";
    if (prob >= 3) motivation = "¡Vas bien! Con más aviones casi aseguras tu viaje ✈️";
    if (prob >= 6) motivation = "¡Excelente estrategia! Eres un viajero serio 🌍";
    if (prob >= 11) motivation = "¡MODO VIAJERO PRO ACTIVADO! El mundo es tuyo 🏆";

    return (
        <div className="fixed bottom-0 left-0 w-full md:left-auto md:right-6 md:bottom-6 md:w-80 bg-navy shadow-2xl border-t md:border border-gold/40 p-6 md:rounded-2xl z-50 animate-bounce-in">
            <h3 className="font-mundo text-gold text-lg mb-4">Tu Itinerario de Vuelo</h3>
            <div className="flex flex-wrap gap-2 mb-4">
                {selectedTickets.map(t => (
                    <span key={t} className="bg-gold/20 text-gold px-2 py-1 rounded border border-gold/30 font-bold">{t}</span>
                ))}
            </div>
            <div className="border-t border-white/10 pt-4 mb-4">
                <div className="flex justify-between mb-1">
                    <span className="text-white/60">Subtotal:</span>
                    <span className="font-bold text-white">${total.toLocaleString()} COP</span>
                </div>
                <div className="flex justify-between mb-4">
                    <span className="text-white/60">Probabilidad:</span>
                    <span className="text-cyan font-bold">{prob}%</span>
                </div>
                <p className="text-sm italic text-center text-white/80 mb-6 font-semibold">"{motivation}"</p>
                <button 
                    onClick={onReserve}
                    className="w-full bg-cyan text-navy font-mundo py-3 rounded-lg hover:bg-cyan/80 transition-colors shadow-lg shadow-cyan/20"
                >
                    RESERVAR MIS AVIONES
                </button>
            </div>
        </div>
    );
};

const HowItWorks = () => (
    <section className="px-6 py-20 max-w-5xl mx-auto border-t border-white/5">
        <h2 className="text-3xl font-mundo mb-12 text-center">¿Cómo funciona el sorteo?</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
                { step: "1", title: "Elige tus aviones", desc: "Selecciona tus números favoritos (00-99) en la pista de despegue." },
                { step: "2", title: "Regístrate y paga", desc: "Completa tus datos y realiza el pago según las instrucciones." },
                { step: "3", title: "Sorteo Lotería", desc: "El sorteo se rige por la Lotería de Medellín en la fecha indicada." },
                { step: "4", title: "¡Gana el Viaje!", desc: "Si tus dos últimas cifras coinciden con el número ganador, ¡VUELAS!" },
            ].map((item, i) => (
                <div key={i} className="text-center group">
                    <div className="w-12 h-12 bg-cyan/10 border border-cyan/30 rounded-full flex items-center justify-center mx-auto mb-4 text-cyan font-bold group-hover:bg-cyan group-hover:text-navy transition-all duration-300">
                        {item.step}
                    </div>
                    <h3 className="font-bold mb-2 text-gold">{item.title}</h3>
                    <p className="text-sm text-white/60">{item.desc}</p>
                </div>
            ))}
        </div>
    </section>
);

const AdminDashboard = ({ onClose }) => {
    const [password, setPassword] = useState('');
    const [authenticated, setAuthenticated] = useState(false);
    const [stats, setStats] = useState({ sold: 0, reserved: 0, confirmed: 0 });
    const [drawForm, setDrawForm] = useState({});
    const [participants, setParticipants] = useState([]);
    const [winnerModal, setWinnerModal] = useState(null);

    // This would normally check against Firebase config
    const handleLogin = () => {
        if (password === 'admin123') setAuthenticated(true);
        else alert('Contraseña incorrecta');
    };

    useEffect(() => {
        if (!authenticated) return;
        // Fetch stats and lists
        db.ref('draws/active').on('value', snap => setDrawForm(snap.val() || {}));
        db.ref('reservations').on('value', snap => {
            const data = snap.val() || {};
            setParticipants(Object.entries(data).map(([id, val]) => ({ id, ...val })));
        });
        return () => {
            db.ref('draws/active').off();
            db.ref('reservations').off();
        };
    }, [authenticated]);

    const handleUpdateDraw = (e) => {
        e.preventDefault();
        db.ref('draws/active').update(drawForm);
        alert('Sorteo actualizado');
    };

    const handleStatusChange = (resId, newStatus, ticketList) => {
        // Update reservation status
        db.ref(`reservations/${resId}`).update({ status: newStatus });
        // Update ticket statuses
        const ticketStatus = newStatus === 'CONFIRMADO' ? 'confirmed' : 'reserved';
        const ticketUpdates = {};
        ticketList.forEach(num => {
            ticketUpdates[num] = ticketStatus;
        });
        db.ref('tickets').update(ticketUpdates);
    };

    const handleReleaseTickets = (resId, ticketList) => {
        if (!confirm('¿Estás seguro de liberar TODOS los aviones de esta reserva?')) return;
        
        const ticketUpdates = {};
        ticketList.forEach(num => {
            ticketUpdates[num] = null; // Setting to null removes the key
        });
        
        db.ref('tickets').update(ticketUpdates);
        db.ref(`reservations/${resId}`).update({ 
            status: 'CANCELADO',
            released_at: firebase.database.ServerValue.TIMESTAMP,
            released_by: 'admin',
            released_tickets: ticketList
        });
        alert('Aviones liberados con éxito.');
    };

    const handleReleaseSingleTicket = (resId, ticketNum, currentTicketList) => {
        if (!confirm(`¿Liberar solo el avión ${ticketNum}?`)) return;

        // 1. Mark ticket as available
        db.ref(`tickets/${ticketNum}`).set(null);

        // 2. Remove from reservation list
        const updatedList = currentTicketList.filter(t => t !== ticketNum);
        
        const updates = {
            tickets: updatedList,
            last_edit: firebase.database.ServerValue.TIMESTAMP
        };

        // 3. If no tickets left, cancel reservation
        if (updatedList.length === 0) {
            updates.status = 'CANCELADO';
        }

        // 4. Log the release in a history node
        db.ref(`reservations/${resId}/logs`).push({
            action: 'PARCIAL_RELEASE',
            ticket: ticketNum,
            timestamp: firebase.database.ServerValue.TIMESTAMP
        });

        db.ref(`reservations/${resId}`).update(updates);
    };

    const handleIdentifyWinner = (fullNumber) => {
        const lastTwo = fullNumber.slice(-2);
        const winners = participants.filter(p => 
            Object.values(p.tickets || {}).includes(lastTwo)
        );
        setWinnerModal({ number: lastTwo, winners });
    };

    if (!authenticated) {
        return (
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-navy/95">
                <div className="bg-navy border border-white/10 p-8 rounded-2xl w-full max-w-sm text-center">
                    <h2 className="font-mundo text-2xl mb-6">Acceso Seguridad</h2>
                    <input 
                        type="password" 
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 p-3 rounded mb-4"
                        placeholder="Contraseña"
                    />
                    <button onClick={handleLogin} className="w-full bg-gold text-navy font-bold py-3 rounded">ENTRAR</button>
                    <button onClick={onClose} className="mt-4 text-xs opacity-40">CERRAR</button>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-[100] flex bg-navy overflow-y-auto">
            <div className="w-full max-w-6xl mx-auto p-10">
                <div className="flex justify-between items-center mb-10">
                    <h1 className="text-4xl font-mundo text-gold">Panel de Control</h1>
                    <button onClick={onClose} className="bg-white/10 px-4 py-2 rounded">SALIR</button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
                    <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                        <h3 className="text-xs uppercase opacity-50 mb-2">Configurar Sorteo</h3>
                        <form onSubmit={handleUpdateDraw} className="space-y-4">
                            <input className="w-full bg-white/5 p-2 rounded text-sm" placeholder="Destino" value={drawForm.destination || ''} onChange={e => setDrawForm({...drawForm, destination: e.target.value})} />
                            <input className="w-full bg-white/5 p-2 rounded text-sm" type="date" value={drawForm.date || ''} onChange={e => setDrawForm({...drawForm, date: e.target.value})} />
                            <input className="w-full bg-white/5 p-2 rounded text-sm" placeholder="Precio COP" value={drawForm.price || ''} onChange={e => setDrawForm({...drawForm, price: e.target.value})} />
                            <textarea className="w-full bg-white/5 p-2 rounded text-sm h-24" placeholder="Instrucciones de Pago" value={drawForm.paymentInstructions || ''} onChange={e => setDrawForm({...drawForm, paymentInstructions: e.target.value})} />
                            <button className="w-full bg-cyan text-navy font-bold py-2 rounded">GUARDAR</button>
                        </form>
                    </div>

                    <div className="md:col-span-2 bg-white/5 p-6 rounded-2xl border border-white/10">
                        <h3 className="text-xs uppercase opacity-50 mb-4">Participantes</h3>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead>
                                    <tr className="border-b border-white/10">
                                        <th className="py-2">Nombre</th>
                                        <th className="py-2">WhatsApp</th>
                                        <th className="py-2">Números</th>
                                        <th className="py-2">Estado</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {participants.map(p => {
                                        const tList = Array.isArray(p.tickets) ? p.tickets : (p.tickets ? Object.values(p.tickets) : []);
                                        return (
                                            <tr key={p.id} className="border-b border-white/5">
                                                <td className="py-3">{p.user?.name}</td>
                                                <td className="py-3 text-cyan">{p.user?.phone}</td>
                                                <td className="py-3">
                                                    <div className="flex flex-wrap gap-1">
                                                        {tList.map(num => (
                                                            <span key={num} className="group relative bg-white/10 px-2 py-1 rounded text-[10px] font-bold flex items-center gap-1">
                                                                {num}
                                                                {p.status !== 'CANCELADO' && (
                                                                    <button 
                                                                        onClick={() => handleReleaseSingleTicket(p.id, num, tList)}
                                                                        className="opacity-0 group-hover:opacity-100 text-red-500 hover:scale-120 transition-all"
                                                                        title="Liberar solo este avión"
                                                                    >
                                                                        ×
                                                                    </button>
                                                                )}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </td>
                                                <td className="py-3 flex items-center gap-2">
                                                    <select 
                                                        value={p.status}
                                                        onChange={(e) => handleStatusChange(p.id, e.target.value, tList)}
                                                        className="bg-navy border border-white/20 rounded p-1 text-[10px]"
                                                    >
                                                        <option value="RESERVADO">RESERVADO</option>
                                                        <option value="CONFIRMADO">CONFIRMADO</option>
                                                        <option value="CANCELADO">CANCELADO</option>
                                                    </select>
                                                    {p.status !== 'CANCELADO' && tList.length > 1 && (
                                                        <button 
                                                            onClick={() => handleReleaseTickets(p.id, tList)}
                                                            className="bg-red-500/20 text-red-500 hover:bg-red-500 hover:text-white px-2 py-1 rounded text-[10px] transition-colors"
                                                            title="Liberar todos los números de esta reserva"
                                                        >
                                                            LIBERAR TODO
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                        <button 
                            onClick={() => {
                                const headers = "Nombre,Telefono,Email,Tickets,Estado\n";
                                const rows = participants.map(p => {
                                    const ticketList = Array.isArray(p.tickets) ? p.tickets.join(', ') : (p.tickets ? Object.values(p.tickets).join(', ') : '');
                                    return `${p.user?.name},${p.user?.phone},${p.user?.email},"${ticketList}",${p.status}`;
                                }).join("\n");
                                const blob = new Blob([headers + rows], { type: 'text/csv' });
                                const url = window.URL.createObjectURL(blob);
                                const a = document.createElement('a');
                                a.setAttribute('href', url);
                                a.setAttribute('download', 'participantes.csv');
                                a.click();
                            }}
                            className="mt-4 text-[10px] text-cyan hover:underline"
                        >
                            EXPORTAR LISTA (CSV)
                        </button>
                    </div>
                </div>

                <div className="bg-gold/10 border border-gold/30 p-8 rounded-2xl text-center">
                    <h3 className="font-mundo text-xl text-gold mb-4">DETERMINAR GANADOR</h3>
                    <p className="text-sm mb-6 opacity-60">Ingresa el número completo de la Lotería de Medellín</p>
                    <div className="flex justify-center gap-4">
                        <input id="lotteryNum" className="bg-white/10 border border-gold/40 text-2xl font-mundo w-40 text-center rounded p-2" placeholder="0000" maxLength="4" />
                        <button 
                            onClick={() => handleIdentifyWinner(document.getElementById('lotteryNum').value)}
                            className="bg-gold text-navy font-bold px-8 rounded shadow-lg shadow-gold/20"
                        >
                            BUSCAR GANADOR
                        </button>
                    </div>
                </div>
                
                {winnerModal && (
                    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-navy/95 backdrop-blur-xl">
                        <div className="text-center max-w-lg">
                            <h2 className="text-6xl font-mundo text-gold mb-2">¡NÚMERO {winnerModal.number}!</h2>
                            <p className="mb-8 text-cyan tracking-widest">RESULTADO LOTERÍA DE MEDELLÍN</p>
                            
                            {winnerModal.winners.length > 0 ? (
                                <div className="bg-white/10 p-8 rounded-3xl border border-white/20">
                                    <p className="text-xs uppercase opacity-50 mb-4">VIAJERO GANADOR:</p>
                                    <h3 className="text-3xl font-bold mb-2">{winnerModal.winners[0].user?.name}</h3>
                                    <p className="text-gold text-xl mb-4">{winnerModal.winners[0].user?.phone}</p>
                                    <button className="bg-cyan text-navy font-bold px-6 py-2 rounded-full">NOTIFICAR POR WHATSAPP ✓</button>
                                </div>
                            ) : (
                                <div className="bg-white/5 p-8 rounded-3xl border border-white/10">
                                    <p className="text-2xl font-bold italic opacity-30">NÚMERO DESIERTO</p>
                                    <p className="text-sm opacity-50 mt-2">No hubo participantes con este número.</p>
                                </div>
                            )}
                            <button onClick={() => setWinnerModal(null)} className="mt-10 text-white/40 border-b border-white/20">CERRAR RESULTADOS</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

// --- Main App Component ---

const App = () => {
    const [draw, setDraw] = useState({ destination: 'Cargando...', price: 0, soldCount: 0 });
    const [tickets, setTickets] = useState({});
    const [selectedTickets, setSelectedTickets] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        // Listen to drawing info
        db.ref('draws/active').on('value', snap => {
            if (snap.exists()) setDraw(snap.val());
        });

        // Listen to ticket states
        db.ref('tickets').on('value', snap => {
            if (snap.exists()) {
                const ticketData = snap.val();
                setTickets(ticketData);
                // Calculate sold count dynamically
                const taken = Object.values(ticketData).filter(s => s !== 'available').length;
                setDraw(prev => ({ ...prev, soldCount: taken }));
            }
        });

        return () => {
            db.ref('draws/active').off();
            db.ref('tickets').off();
        };
    }, []);

    const toggleTicket = (num) => {
        setSelectedTickets(prev => 
            prev.includes(num) ? prev.filter(t => t !== num) : [...prev, num]
        );
        // Sound effect (ping de aeropuerto)
        const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2361/2361-preview.mp3');
        audio.volume = 0.2;
        audio.play().catch(() => {}); // Ignore interaction blocked
    };

    const handleReserveSubmit = (userData) => {
        const reservationId = Date.now();
        const updates = {};
        let conflictOccurred = false;

        // Atomic transaction to reserve tickets
        db.ref('tickets').transaction((currentTickets) => {
            currentTickets = currentTickets || {};
            // Check if all selected tickets are still available
            for (let num of selectedTickets) {
                if (currentTickets[num] && currentTickets[num] !== 'available' && currentTickets[num] !== 'selected') {
                    conflictOccurred = true;
                    return; // Abort transaction
                }
            }
            
            // If all available, mark as reserved
            selectedTickets.forEach(num => {
                currentTickets[num] = 'reserved';
            });
            return currentTickets;
        }, (error, committed, snapshot) => {
            if (error) {
                alert('Ocurrió un error en el servidor. Inténtalo de nuevo.');
            } else if (!committed) {
                alert('¡Oops! Un avión que elegiste acaba de ser tomado. Por favor, revisa tu selección.');
            } else {
                // Transaction successful, create reservation record
                db.ref(`reservations/${reservationId}`).set({
                    user: userData,
                    tickets: selectedTickets,
                    status: 'RESERVADO',
                    timestamp: firebase.database.ServerValue.TIMESTAMP
                });
                
                setIsModalOpen(false);
                setSelectedTickets([]);
                confetti({
                    particleCount: 150,
                    spread: 70,
                    origin: { y: 0.6 },
                    colors: ['#F5A800', '#00AEEF', '#FFFFFF']
                });
                alert('¡Tu reserva está lista! Revisa tu correo ✉️');
            }
        });
    };

    return (
        <div className="relative min-h-screen pb-24">
            <Header />
            <Hero draw={draw} />
            <Grid tickets={tickets} selectedTickets={selectedTickets} onSelect={toggleTicket} />
            <HowItWorks />
            
            <SidebarPanel 
                selectedTickets={selectedTickets} 
                price={draw.price} 
                onReserve={() => setIsModalOpen(true)}
            />

            {/* Admin Portal */}
            {isAdmin && <AdminDashboard onClose={() => setIsAdmin(false)} />}

            {/* Boarding Pass Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/90 backdrop-blur-sm">
                    <div className="boarding-pass shadow-2xl animate-fade-in w-full max-w-lg">
                        <div className="pass-header">
                            <div>
                                <p className="text-[10px] tracking-widest text-cyan uppercase mb-1">Vuelo Sorteo</p>
                                <h3 className="font-mundo text-xl">{draw.destination}</h3>
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] tracking-widest text-white/40 uppercase mb-1">Total</p>
                                <p className="text-gold font-bold">${(selectedTickets.length * draw.price).toLocaleString()} COP</p>
                            </div>
                        </div>
                        <div className="p-6">
                            <form className="space-y-4" onSubmit={(e) => {
                                e.preventDefault();
                                const formData = new FormData(e.target);
                                handleReserveSubmit(Object.fromEntries(formData));
                            }}>
                                <div>
                                    <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">Nombre Completo</label>
                                    <input name="name" required className="w-full border-b-2 border-gray-200 py-2 focus:border-cyan outline-none transition-colors" placeholder="JUAN PEREZ" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">Teléfono</label>
                                        <input name="phone" required className="w-full border-b-2 border-gray-200 py-2 focus:border-cyan outline-none transition-colors" defaultValue="+57 " />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">Correo</label>
                                        <input name="email" type="email" required className="w-full border-b-2 border-gray-200 py-2 focus:border-cyan outline-none transition-colors" placeholder="correo@ejemplo.com" />
                                    </div>
                                </div>
                                <div className="space-y-2 py-4">
                                    <label className="flex items-center gap-2 text-xs">
                                        <input type="checkbox" className="accent-cyan" defaultChecked /> Acepto recibir información sobre sorteos futuros
                                    </label>
                                    <label className="flex items-center gap-2 text-xs">
                                        <input type="checkbox" required className="accent-cyan" /> Acepto los términos y condiciones
                                    </label>
                                </div>
                                
                                <div className="bg-gray-50 p-4 rounded-lg text-[11px] mb-4">
                                    <p className="font-bold mb-1">INSTRUCCIONES DE PAGO:</p>
                                    <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                                        {draw.paymentInstructions || "Realiza tu transferencia a Nequi XXXXXXXXXX a nombre de Viajando X el Mundo. Envía el comprobante a WhatsApp."}
                                    </p>
                                </div>

                                <button type="submit" className="w-full bg-navy text-white font-mundo py-4 rounded-xl hover:bg-navy/90 transition-all flex items-center justify-center gap-2">
                                    CONFIRMAR Y RESERVAR ✈️
                                </button>
                                <button type="button" onClick={() => setIsModalOpen(false)} className="w-full text-gray-400 text-xs py-2">CANCELAR MI VUELO</button>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Admin Footer Trigger */}
            <footer className="p-10 text-center text-white/20 text-[10px]">
                <p>© 2024 VIAJANDO X EL MUNDO. TODOS LOS DERECHOS RESERVADOS.</p>
                <button onClick={() => setIsAdmin(true)} className="mt-4 hover:text-white/40 transition-colors">ACCESO TRIPULACIÓN</button>
            </footer>
        </div>
    );
};

// Start the app
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
