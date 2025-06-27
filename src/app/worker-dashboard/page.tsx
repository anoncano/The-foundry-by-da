    "use client";

    import React from "react";

    declare global {
        interface Window {
            jspdf: any;
            ActiveXObject: any;
            Quill: any;
            ReactQuill: any;
            html2canvas: any;
        }
    }
    import {
    Clock,
    FileText,
    User,
    X,
    Download,
    ClipboardList,
    ChevronDown,
    Plus,
    Edit,
    Trash2,
    Archive,
    ArrowLeft,
    Users,
    Send,
    DollarSign,
    Upload,
    Link as LinkIcon,
    Calendar,
    Search,
    Filter,
    LayoutDashboard,
    Pin,
    PinOff,
    FileSignature,
    View,
    Palette,
    Settings,
    Eye,
    Type,
    ImageIcon,
    MessageSquare,
    Footprints,
    Bold,
    Italic,
    List,
    Indent,
    Outdent,
    } from "lucide-react";


    // --- Data Interfaces (Updated) ---
    interface CustomField {
    key: string;
    value: string;
    }

    interface ScheduleItem {
        id: number;
        day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
        startTime: string;
        endTime: string;
        service: string;
    }

    // Updated InvoiceTemplate to support more customization
    interface InvoiceTemplate {
        id: number;
        name: string;
        // Template data structure
        from: string;
        to: string;
        logo: string;
        invoiceTitle: string;
        fields: { id: number, label: string, value: string, enabled: boolean }[];
        items: { id: number, desc: string, qty: string, unit_price: string, amount: string }[];
        totals: { label: string, value: string, enabled: boolean, isCurrency: boolean }[];
        notes: string;
        footer: string;
        // Styling
        accentColor: string;
        font: 'Helvetica' | 'Times' | 'Courier';
        // Visibility toggles
        show: {
            logo: boolean;
            from: boolean;
            to: boolean;
            notes: boolean;
            footer: boolean;
        }
    }

    interface Service {
    id: number;
    name: string;
    rate: string;
    unit: string;
    type: "service" | "product";
    }

    interface Client {
    id: number;
    name: string;
    email: string;
    phone: string;
    notes?: string;
    services: string[];
    templateId?: number;
    customFields?: CustomField[];
    schedule?: ScheduleItem[];
    }

    interface InvoiceItem {
    id: number;
    description: string;
    qty: number;
    unit_price: number;
    }

    interface Invoice {
    id: number;
    client: string;
    date: string;
    items: InvoiceItem[];
    status: "draft" | "sent" | "paid";
    note?: string;
    templateId?: number;
    }

    interface Shift {
        id: number;
        client: string;
        service: string;
        date: string;
        startTime: string;
        endTime: string;
        notes: string;
    }

    interface Expense {
    id: number;
    date: string;
    description: string;
    category: string;
    amount: number;
    receipt?: File;
    }

    interface RecurringExpense {
        id: number;
        name: string;
        category: string;
        price: number;
    }

    interface WorkerInfo {
        name: string;
        tradingName: string;
        abn: string;
        address: string;
        bankName: string;
        bsb: string;
        accountNumber: string;
        invoiceFrequency: 'Weekly' | 'Fortnightly' | 'Monthly' | 'Custom';
        customInvoiceDays?: number;
        preferredInvoiceDay: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
        automateInvoices: boolean;
    }

    // --- Helper Functions ---
    const getFinancialYear = (dateStr) => {
        const d = new Date(dateStr);
        const year = d.getFullYear();
        const month = d.getMonth(); // 0-indexed (June is 5)
        const startYear = month >= 6 ? year : year - 1;
        return `${startYear}-${(startYear + 1).toString().slice(-2)}`;
    };

    const createDefaultTemplate = (workerInfo: WorkerInfo): Omit<InvoiceTemplate, 'id' | 'name'> => ({
        from: `${workerInfo.tradingName}\n${workerInfo.address}\nABN: ${workerInfo.abn}`,
        to: '[Client Name]\n[Client Address]\n[Client Email]',
        logo: 'https://create.onlineinvoices.com/default-logo.png',
        invoiceTitle: 'TAX INVOICE',
        fields: [
            { id:1, label: 'Invoice #', value: 'INV-001', enabled: true },
            { id:2, label: 'Date', value: new Date().toLocaleDateString('en-AU'), enabled: true },
            { id:3, label: 'Due Date', value: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toLocaleDateString('en-AU'), enabled: true },
            { id:4, label: 'Reference', value: '', enabled: false },
        ],
        items: [
            { id: 1, desc: 'Example Item', qty: '1', unit_price: '100.00', amount: '100.00' },
        ],
        totals: [
            { label: 'Subtotal', value: '100.00', enabled: true, isCurrency: true },
            { label: 'GST (10%)', value: '10.00', enabled: true, isCurrency: true },
            { label: 'Total', value: '110.00', enabled: true, isCurrency: true },
            { label: 'Paid', value: '0.00', enabled: true, isCurrency: true },
            { label: 'Balance Due', value: '110.00', enabled: true, isCurrency: true },
        ],
        notes: 'Thank you for your business. Please make payment within 14 days.',
        footer: `Payment Details\nBank: ${workerInfo.bankName}\nBSB: ${workerInfo.bsb}\nAccount: ${workerInfo.accountNumber}`,
        accentColor: '#E5E5E5',
        font: 'Helvetica',
        show: {
            logo: true,
            from: true,
            to: true,
            notes: true,
            footer: true
        },
    });


    // --- Mock Data ---
    const initialWorkerInfo: WorkerInfo = {
    name: "John Worker",
    tradingName: "John Worker Services",
    abn: "12 345 678 901",
    address: "123 Business St, Sydney, NSW 2000",
    bankName: "ABC Bank",
    bsb: "123-456",
    accountNumber: "12345678",
    invoiceFrequency: 'Weekly',
    customInvoiceDays: 14,
    preferredInvoiceDay: 'Monday',
    automateInvoices: true,
    };

    const initialInvoiceTemplates: InvoiceTemplate[] = [
        {
            id: 1,
            name: 'Default ABN Template',
            ...createDefaultTemplate(initialWorkerInfo)
        }
    ];

    const initialServices: Service[] = [
    { id: 1, name: "Consulting Services", rate: "150", unit: "hr", type: "service" },
    { id: 2, name: "Web Development", rate: "120", unit: "hr", type: "service" },
    { id: 3, name: "Graphic Design", rate: "80", unit: "hr", type: "service" },
    { id: 4, name: "General Labor", rate: "50", unit: "hr", type: "service" },
    { id: 5, name: "Travel Costs", rate: "1.50", unit: "km", type: "service" },
    { id: 6, name: "Hardware Supplies", rate: "1", unit: "item", type: "product" },
    ];

    const initialClients: Client[] = [
    {
        id: 1,
        name: "Global Corp",
        email: "accounts@globalcorp.com",
        phone: "02 9999 8888",
        services: ["Consulting Services", "Web Development"],
        notes: "Monthly retainer.",
        templateId: 1,
        customFields: [
            { key: 'Address', value: 'Level 10, 100 Pitt St, Sydney, NSW 2000' },
            { key: 'Account #', value: 'GC-001' },
        ],
        schedule: [
            { id: 1, day: 'Wednesday', startTime: '10:00', endTime: '12:00', service: 'Consulting Services' },
        ]
    },
    {
        id: 2,
        name: "Local Cafe",
        email: "sara@localcafe.com.au",
        phone: "0400 654 321",
        services: ["Graphic Design", "Hardware Supplies"],
        customFields: [
            { key: 'Address', value: 'Shop 5, 25 Main St, Parramatta, NSW 2150' },
        ],
        schedule: []
    },
    ];

    const initialInvoices: Invoice[] = [
        ...Array.from({length: 25}, (_, i) => ({
        id: 200 + i,
        client: i % 2 === 0 ? "Global Corp" : "Local Cafe",
        date: new Date(new Date().setDate(new Date().getDate() - (i * 5))).toISOString().split("T")[0],
        items: [{ id: 1, description: i % 2 === 0 ? "Web Development" : "Graphic Design", qty: i + 1, unit_price: i % 2 === 0 ? 120 : 80 }],
        status: i < 8 ? 'draft' : i < 18 ? 'sent' : 'paid',
        templateId: i % 2 === 0 ? 1 : undefined,
        })),
    ];

    const initialExpenses: Expense[] = [
        { id: 1, date: '2025-06-20', description: 'Software Subscription', category: 'Software', amount: 49.99 },
        { id: 2, date: '2025-06-10', description: 'Fuel for travel to client', category: 'Travel', amount: 45.70 },
        { id: 3, date: '2025-05-20', description: 'New Monitor', category: 'Equipment', amount: 450.00 },
    ];

    const initialShifts: Shift[] = [
        ...Array.from({length: 22}, (_, i) => ({
            id: 100 + i, client: i % 2 === 0 ? 'Global Corp' : 'Local Cafe', service: i % 2 === 0 ? 'Consulting Services' : 'Graphic Design', date: `2025-06-${20-i > 0 ? 20-i : 1}`, startTime: '09:00', endTime: '11:00', notes: `Worked on project X, task #${i+1}.`
        })),
    ]

    const initialRecurringExpenses: RecurringExpense[] = [
        {id: 1, name: 'Phone Bill', category: 'Utilities', price: 79.00},
        {id: 2, name: 'Travel (per km)', category: 'Travel', price: 0.85},
        {id: 3, name: 'Office Supplies', category: 'Supplies', price: 50.00},
    ];


    // --- Reusable UI Components ---

    const StatCard = ({ title, value, icon, onClick, tabKey }) => (
    <button
        onClick={() => onClick(tabKey)}
        className="bg-white p-5 rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-300 w-full text-left group"
    >
        <div className="flex justify-between items-start">
        <p className="text-slate-500 text-sm font-medium">{title}</p>
        <div className="bg-sky-100 text-sky-600 p-2 rounded-lg">
            {icon}
        </div>
        </div>
        <p className="text-3xl font-bold text-slate-800 mt-2">{value}</p>
    </button>
    );

    const QuickActionButton = ({ title, icon, onClick, draggableProps }) => (
    <div {...draggableProps} className="cursor-move">
        <button
            onClick={onClick}
            className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-medium py-4 px-4 rounded-xl flex flex-col items-center justify-center space-y-2.5 shadow-sm hover:shadow-md transition-all duration-300 text-center h-full w-full"
        >
            <div className="bg-indigo-100 text-indigo-600 p-3 rounded-full">
            {icon}
            </div>
            <span className="text-sm">{title}</span>
        </button>
    </div>
    );

    function AppModal({ isOpen, onClose, children, title, maxWidth="max-w-md" }) {
    const modalRef = React.useRef<HTMLDivElement | null>(null);

    React.useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
        if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
            onClose();
        }
        }
        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => {
        document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex justify-center items-center p-4 bg-black/50 backdrop-blur-sm transition-opacity duration-300">
        <div
            ref={modalRef}
            className={`bg-white p-6 rounded-xl shadow-2xl relative w-full ${maxWidth} z-10 max-h-[90vh] overflow-y-auto transform transition-all duration-300 scale-95 opacity-0 animate-fade-in-scale`}
        >
            <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-800 transition-colors"
            >
            <X size={24} />
            </button>
            <h2 className="text-xl font-semibold mb-4 text-slate-800">{title}</h2>
            {children}
        </div>
        </div>
    );
    }

    // --- NEWLY ADDED/FIXED COMPONENTS ---

    const ProfileDropdown = ({ workerInfo, onEditProfile, onEditTemplates }) => {
        const [isOpen, setIsOpen] = React.useState(false);
        const dropdownRef = React.useRef(null);

        React.useEffect(() => {
            const handleClickOutside = (event) => {
                if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                    setIsOpen(false);
                }
            };
            document.addEventListener("mousedown", handleClickOutside);
            return () => document.removeEventListener("mousedown", handleClickOutside);
        }, []);

        return (
            <div className="relative" ref={dropdownRef}>
                <button onClick={() => setIsOpen(!isOpen)} className="flex items-center gap-2 p-2 rounded-full hover:bg-slate-100">
                    <div className="w-8 h-8 rounded-full bg-indigo-500 text-white flex items-center justify-center font-bold">
                        {workerInfo.name.charAt(0)}
                    </div>
                    <span className="hidden sm:inline font-semibold text-slate-700">{workerInfo.name}</span>
                    <ChevronDown size={16} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>
                {isOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border z-50 overflow-hidden">
                        <div className="p-3 border-b">
                            <p className="font-semibold text-sm text-slate-800">{workerInfo.name}</p>
                            <p className="text-xs text-slate-500">{workerInfo.tradingName}</p>
                        </div>
                        <div className="p-1">
                            <button onClick={() => { onEditProfile(); setIsOpen(false); }} className="w-full text-left flex items-center gap-3 px-3 py-2 text-sm text-slate-700 rounded-md hover:bg-slate-100">
                            <User size={16} /> Edit Profile
                            </button>
                            <button onClick={() => { onEditTemplates(); setIsOpen(false); }} className="w-full text-left flex items-center gap-3 px-3 py-2 text-sm text-slate-700 rounded-md hover:bg-slate-100">
                            <Palette size={16} /> Edit Templates
                            </button>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    const OverviewCard = ({ title, onPin, isPinned, draggableProps, children }) => (
        <div className="bg-white p-6 rounded-xl shadow-sm" {...draggableProps}>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-slate-800">{title}</h2>
                <button onClick={onPin} className="p-2 text-slate-400 hover:text-indigo-600" title={isPinned ? "Unpin Widget" : "Pin Widget"}>
                    {isPinned ? <Pin size={18} className="text-indigo-600"/> : <PinOff size={18}/>}
                </button>
            </div>
            {children}
        </div>
    );

    const EditOverviewModal = ({ isOpen, onClose, uiSettings, onSave }) => {
        const [settings, setSettings] = React.useState(uiSettings);

        const handleNavChange = (key) => {
            setSettings(prev => ({
                ...prev,
                navItems: {
                    ...prev.navItems,
                    [key]: { ...prev.navItems[key], visible: !prev.navItems[key].visible }
                }
            }));
        };

        const handleWidgetChange = (key) => {
            setSettings(prev => ({
                ...prev,
                overviewWidgets: {
                    ...prev.overviewWidgets,
                    [key]: { ...prev.overviewWidgets[key], visible: !prev.overviewWidgets[key].visible }
                }
            }));
        }

        const handleSave = () => {
            onSave(settings);
            onClose();
        }

        return (
            <AppModal isOpen={isOpen} onClose={onClose} title="Customize Overview" maxWidth="max-w-lg">
                <div className="space-y-6">
                    <div>
                        <h3 className="font-semibold text-slate-700 mb-2">Navigation Links</h3>
                        <div className="grid grid-cols-2 gap-2">
                            {Object.entries(settings.navItems).map(([key, item]) => (
                                <label key={key} className="flex items-center gap-2 p-2 rounded-md hover:bg-slate-50 cursor-pointer">
                                    <input type="checkbox" checked={item.visible} onChange={() => handleNavChange(key)} className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                                    <span>{item.label}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                    <div>
                        <h3 className="font-semibold text-slate-700 mb-2">Overview Widgets</h3>
                        <div className="space-y-2">
                            {Object.entries(settings.overviewWidgets).map(([key, item]) => (
                                <label key={key} className="flex items-center gap-2 p-2 rounded-md hover:bg-slate-50 cursor-pointer">
                                    <input type="checkbox" checked={item.visible} onChange={() => handleWidgetChange(key)} className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"/>
                                    <span>{item.title}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                    <div className="flex justify-end pt-4 border-t">
                        <button onClick={handleSave} className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-semibold">Save Changes</button>
                    </div>
                </div>
            </AppModal>
        );
    }

    const SendInvoicesModal = ({ isOpen, onClose, draftInvoices, onSend }) => {
        const [selected, setSelected] = React.useState<number[]>([]);

        const handleToggle = (id) => {
            setSelected(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
        };

        const handleSend = () => {
            onSend(selected);
            setSelected([]);
            onClose();
        };

        return (
            <AppModal isOpen={isOpen} onClose={onClose} title="Send Draft Invoices">
                <div className="space-y-3 max-h-80 overflow-y-auto">
                    {draftInvoices.map(inv => (
                        <label key={inv.id} className="flex items-center p-3 rounded-lg border hover:bg-slate-50 cursor-pointer">
                            <input type="checkbox" onChange={() => handleToggle(inv.id)} checked={selected.includes(inv.id)} className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 mr-4"/>
                            <div className="flex-grow">
                                <p className="font-semibold text-slate-700">Invoice #{inv.id} - {inv.client}</p>
                                <p className="text-sm text-slate-500">
                                    {new Date(inv.date).toLocaleDateString()} - ${inv.items.reduce((s, it) => s + it.qty * it.unit_price, 0).toFixed(2)}
                                </p>
                            </div>
                        </label>
                    ))}
                </div>
                <div className="mt-6 flex justify-end">
                    <button onClick={handleSend} disabled={selected.length === 0} className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-semibold flex items-center gap-2 disabled:bg-indigo-300 disabled:cursor-not-allowed">
                        <Send size={16}/> Send {selected.length} Invoice(s)
                    </button>
                </div>
            </AppModal>
        )
    };


    // --- Editor Components ---

    function ProfileEditor({ workerInfo, onSave, onBack }) {
        const [info, setInfo] = React.useState(workerInfo);

        const handleChange = (e) => {
            const { name, value, type, checked } = e.target;
            setInfo(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
        };

        const handleSubmit = (e) => {
            e.preventDefault();
            onSave(info);
            onBack();
        };

        return (
            <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="form-label" htmlFor="worker-name">Full Name</label>
                        <input id="worker-name" name="name" className="form-input" value={info.name} onChange={handleChange} required />
                    </div>
                    <div>
                        <label className="form-label" htmlFor="worker-trading">Trading Name</label>
                        <input id="worker-trading" name="tradingName" className="form-input" value={info.tradingName} onChange={handleChange} />
                    </div>
                </div>
                <div>
                    <label className="form-label" htmlFor="worker-abn">ABN</label>
                    <input id="worker-abn" name="abn" className="form-input" value={info.abn} onChange={handleChange} />
                </div>
                <div>
                    <label className="form-label" htmlFor="worker-address">Address</label>
                    <input id="worker-address" name="address" className="form-input" value={info.address} onChange={handleChange} />
                </div>
                <div className="border-t pt-4 space-y-4">
                    <h3 className="font-semibold text-slate-700">Invoice Settings</h3>
                    <div className="flex items-center justify-between bg-slate-50 p-3 rounded-lg">
                        <label className="font-medium text-slate-700" htmlFor="automateInvoices">Automate Invoicing</label>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" name="automateInvoices" checked={info.automateInvoices} onChange={handleChange} id="automateInvoices" className="sr-only peer" />
                            <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-indigo-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                        </label>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="form-label" htmlFor="worker-invoice-frequency">Frequency</label>
                            <select id="worker-invoice-frequency" name="invoiceFrequency" className="form-input" value={info.invoiceFrequency} onChange={handleChange}>
                                <option>Weekly</option>
                                <option>Fortnightly</option>
                                <option>Monthly</option>
                                <option>Custom</option>
                            </select>
                        </div>
                        <div>
                            <label className="form-label" htmlFor="worker-preferred-day">Preferred Send Day</label>
                            <select id="worker-preferred-day" name="preferredInvoiceDay" className="form-input" value={info.preferredInvoiceDay} onChange={handleChange}>
                                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => <option key={day}>{day}</option>)}
                            </select>
                        </div>
                    </div>
                    {info.invoiceFrequency === 'Custom' && (
                        <div>
                            <label className="form-label" htmlFor="worker-custom-days">Invoice Every (days)</label>
                            <input id="worker-custom-days" name="customInvoiceDays" type="number" className="form-input" value={info.customInvoiceDays || ''} onChange={handleChange} placeholder="e.g. 30"/>
                        </div>
                    )}
                </div>
                <div className="border-t pt-4 space-y-4">
                    <h3 className="font-semibold text-slate-700">Bank Details</h3>
                    <div>
                        <label className="form-label" htmlFor="worker-bank">Bank Name</label>
                        <input id="worker-bank" name="bankName" className="form-input" value={info.bankName} onChange={handleChange} />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="form-label" htmlFor="worker-bsb">BSB</label>
                            <input id="worker-bsb" name="bsb" className="form-input" value={info.bsb} onChange={handleChange} />
                        </div>
                        <div>
                            <label className="form-label" htmlFor="worker-account">Account Number</label>
                            <input id="worker-account" name="accountNumber" className="form-input" value={info.accountNumber} onChange={handleChange} />
                        </div>
                    </div>
                </div>
                <div className="flex justify-end pt-4">
                    <button type="submit" className="w-full sm:w-auto px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-semibold">Save Profile</button>
                </div>
            </form>
        );
    }

    function ClientEditor({ client, onSave, onBack, services, templates, isModal=false }) {
        const [fields, setFields] = React.useState({
            name: client?.name || '',
            email: client?.email || '',
            phone: client?.phone || '',
            notes: client?.notes || '',
            templateId: client?.templateId || -1,
        });
        const [clientServices, setClientServices] = React.useState<string[]>(client?.services || []);
        const [customFields, setCustomFields] = React.useState<CustomField[]>(client?.customFields || []);
        const [schedule, setSchedule] = React.useState<ScheduleItem[]>(client?.schedule || []);

        const handleFieldChange = (e) => {
            const {name, value} = e.target;
            setFields(prev => ({ ...prev, [name]: name === 'templateId' ? Number(value) : value }));
        };

        const handleServiceToggle = (serviceName: string) => {
            setClientServices(prev => 
                prev.includes(serviceName) 
                ? prev.filter(s => s !== serviceName)
                : [...prev, serviceName]
            );
        };

        const handleAddCustomField = () => {
            setCustomFields([...customFields, { key: '', value: '' }]);
        };

        const handleCustomFieldChange = (index, fieldName, value) => {
            const newCustomFields = [...customFields];
            newCustomFields[index][fieldName] = value;
            setCustomFields(newCustomFields);
        };
        
        const handleAddScheduleItem = () => {
            setSchedule([...schedule, { id: Date.now(), day: 'Monday', startTime: '09:00', endTime: '10:00', service: ''}])
        }

        const handleScheduleChange = (index, fieldName, value) => {
            const newSchedule = [...schedule];
            newSchedule[index][fieldName] = value;
            setSchedule(newSchedule);
        }
        
        const handleRemoveScheduleItem = (id) => {
            setSchedule(schedule.filter(item => item.id !== id));
        }

        const handleRemoveCustomField = (index) => {
            setCustomFields(customFields.filter((_, i) => i !== index));
        };

        const handleSubmit = (e) => {
            e.preventDefault();
            onSave({
                ...client,
                ...fields,
                templateId: fields.templateId === -1 ? undefined : fields.templateId,
                services: clientServices,
                customFields: customFields.filter(f => f.key && f.value),
                schedule: schedule.filter(s => s.service),
            });
            if (onBack) onBack();
        };
        
        const EditorWrapper = isModal ? 'div' : 'div';
        const wrapperProps = isModal ? {} : { className: "bg-white p-6 rounded-xl shadow-lg max-w-2xl mx-auto" };

        return (
            <EditorWrapper {...wrapperProps}>
                {!isModal && (
                    <div className="flex items-center gap-4 mb-6">
                        <button onClick={onBack} className="text-slate-500 hover:text-slate-900"><ArrowLeft size={20}/></button>
                        <h2 className="text-2xl font-bold text-slate-800">{client ? 'Edit Client' : 'New Client'}</h2>
                    </div>
                )}
                <form className="space-y-4 divide-y divide-slate-200" onSubmit={handleSubmit}>
                    <div className="pt-4 space-y-4">
                        <h3 className="font-semibold text-slate-700">Contact Information</h3>
                        <div>
                            <label className="form-label" htmlFor="client-name">Client Name</label>
                            <input id="client-name" name="name" className="form-input" value={fields.name} onChange={handleFieldChange} placeholder="Client Name" required/>
                        </div>
                        <div>
                            <label className="form-label" htmlFor="client-email">Email</label>
                            <input id="client-email" name="email" className="form-input" value={fields.email} onChange={handleFieldChange} placeholder="Email" type="email"/>
                        </div>
                        <div>
                            <label className="form-label" htmlFor="client-phone">Phone</label>
                            <input id="client-phone" name="phone" className="form-input" value={fields.phone} onChange={handleFieldChange} placeholder="Phone"/>
                        </div>
                        <div>
                            <label className="form-label" htmlFor="client-notes">Notes</label>
                            <textarea id="client-notes" name="notes" className="form-input" value={fields.notes} onChange={handleFieldChange} placeholder="Notes..."></textarea>
                        </div>
                    </div>

                    <div className="pt-4 space-y-3">
                        <h3 className="font-semibold text-slate-700">Invoice Template</h3>
                        <div>
                            <label className="form-label" htmlFor="templateId">PDF Template</label>
                            <select id="templateId" name="templateId" className="form-input" value={fields.templateId} onChange={handleFieldChange}>
                            <option value={-1}>Default Template</option>
                            {templates.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="pt-4 space-y-3">
                        <h3 className="font-semibold text-slate-700">Services</h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                            {services.map(service => (
                                <label key={service.id} className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-colors ${clientServices.includes(service.name) ? 'bg-indigo-50 border-indigo-300' : 'hover:bg-slate-50'}`}>
                                    <input type="checkbox"
                                        checked={clientServices.includes(service.name)}
                                        onChange={() => handleServiceToggle(service.name)}
                                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                    />
                                    <span className="text-sm font-medium">{service.name}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="pt-4 space-y-3">
                        <h3 className="font-semibold text-slate-700">Weekly Schedule</h3>
                        {schedule.map((item, index) => (
                            <div key={item.id} className="grid grid-cols-12 gap-2 items-end">
                                <div className="col-span-3">
                                    <label className="form-label">Day</label>
                                    <select className="form-input" value={item.day} onChange={(e) => handleScheduleChange(index, 'day', e.target.value)}>
                                        {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => <option key={day}>{day}</option>)}
                                    </select>
                                </div>
                                <div className="col-span-2">
                                    <label className="form-label">Start</label>
                                    <input type="time" className="form-input" value={item.startTime} onChange={(e) => handleScheduleChange(index, 'startTime', e.target.value)} />
                                </div>
                                <div className="col-span-2">
                                    <label className="form-label">End</label>
                                    <input type="time" className="form-input" value={item.endTime} onChange={(e) => handleScheduleChange(index, 'endTime', e.target.value)} />
                                </div>
                                <div className="col-span-4">
                                    <label className="form-label">Service</label>
                                    <select className="form-input" value={item.service} onChange={(e) => handleScheduleChange(index, 'service', e.target.value)}>
                                        <option value="">Select...</option>
                                        {services.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                                    </select>
                                </div>
                                <div className="col-span-1 text-center">
                                    <button type="button" onClick={() => handleRemoveScheduleItem(item.id)} className="p-2 text-slate-400 hover:text-red-500"><Trash2 size={16}/></button>
                                </div>
                            </div>
                        ))}
                        <button type="button" onClick={handleAddScheduleItem}
                        className="text-indigo-600 hover:text-indigo-800 text-sm font-semibold flex items-center gap-1">
                        <Plus size={16}/> Add Schedule
                        </button>
                    </div>
                    
                    <div className="pt-4 space-y-3">
                        <h3 className="font-semibold text-slate-700">Additional Information</h3>
                        {customFields.map((field, index) => (
                            <div key={index} className="grid grid-cols-12 gap-2 items-center">
                                <div className="col-span-5">
                                    <label className="form-label sr-only">Field Name</label>
                                    <input 
                                        className="form-input" 
                                        value={field.key} 
                                        onChange={(e) => handleCustomFieldChange(index, 'key', e.target.value)} 
                                        placeholder="Field Name (e.g. Address)"
                                    />
                                </div>
                                <div className="col-span-6">
                                    <label className="form-label sr-only">Field Value</label>
                                    <input 
                                        className="form-input" 
                                        value={field.value} 
                                        onChange={(e) => handleCustomFieldChange(index, 'value', e.target.value)}
                                        placeholder="Value"
                                    />
                                </div>
                                <div className="col-span-1 text-center">
                                    <button type="button" onClick={() => handleRemoveCustomField(index)} className="p-2 text-slate-400 hover:text-red-500"><Trash2 size={16}/></button>
                                </div>
                            </div>
                        ))}
                        <button type="button" onClick={handleAddCustomField}
                        className="text-indigo-600 hover:text-indigo-800 text-sm font-semibold flex items-center gap-1">
                        <Plus size={16}/> Add Field
                        </button>
                    </div>

                    <div className="flex justify-end pt-4">
                        <button type="submit" className="w-full sm:w-auto px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-semibold">Save Client</button>
                    </div>
                </form>
            </EditorWrapper>
        );
    }

    function ServiceEditor({ service, onSave, onBack, isModal = false }) {
        const [currentService, setCurrentService] = React.useState(service || { name: '', rate: '', unit: ''});

        const handleChange = (e) => {
            const { name, value } = e.target;
            setCurrentService(prev => ({...prev, [name]: value}));
        }

        const handleSubmit = (e) => {
            e.preventDefault();
            onSave(currentService);
            if(onBack) onBack();
        };

        const EditorWrapper = isModal ? 'div' : 'div';
        const wrapperProps = isModal ? {} : { className: "bg-white p-6 rounded-xl shadow-lg max-w-2xl mx-auto" };

        return (
            <EditorWrapper {...wrapperProps}>
                {!isModal && (
                    <div className="flex items-center gap-4 mb-6">
                        <button onClick={onBack} className="text-slate-500 hover:text-slate-900"><ArrowLeft size={20}/></button>
                        <h2 className="text-2xl font-bold text-slate-800">{service ? 'Edit Service' : 'New Service'}</h2>
                    </div>
                )}
                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div>
                        <label className="form-label" htmlFor="service-name">Service Name</label>
                        <input id="service-name" name="name" className="form-input" value={currentService.name} onChange={handleChange} placeholder="Service Name" required/>
                    </div>
                    <div>
                        <label className="form-label" htmlFor="service-rate">Rate ($)</label>
                        <input id="service-rate" name="rate" className="form-input" value={currentService.rate} onChange={handleChange} placeholder="50.00" type="number" step="0.01" required/>
                    </div>
                    <div>
                        <label className="form-label" htmlFor="service-unit">Unit</label>
                        <input id="service-unit" name="unit" className="form-input" value={currentService.unit} onChange={handleChange} placeholder="e.g. hrs, item"/>
                    </div>
                    <div className="flex justify-end pt-4">
                        <button type="submit" className="w-full sm:w-auto px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-semibold">Save Service</button>
                    </div>
                </form>
            </EditorWrapper>
        );
    }

    function RecurringExpenseEditor({ item, onSave, onBack }) {
        const handleSubmit = (e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            onSave({
                name: formData.get('name') as string,
                category: formData.get('category') as string,
                price: parseFloat(formData.get('price') as string),
            });
            if(onBack) onBack();
        };

        return (
            <form className="space-y-4" onSubmit={handleSubmit}>
                <div>
                    <label className="form-label" htmlFor="re-name">Item Name</label>
                    <input id="re-name" name="name" className="form-input" defaultValue={item?.name} placeholder="e.g. Travel (per km)" required />
                </div>
                <div>
                    <label className="form-label" htmlFor="re-category">Category</label>
                    <select id="re-category" name="category" className="form-input" defaultValue={item?.category || ""} required>
                        <option value="" disabled>Select Category...</option>
                        <option>Travel</option>
                        <option>Materials</option>
                        <option>Equipment</option>
                        <option>Insurance</option>
                        <option>Other</option>
                    </select>
                </div>
                <div>
                    <label className="form-label" htmlFor="re-price">Price ($)</label>
                    <input id="re-price" name="price" className="form-input" defaultValue={item?.price} placeholder="0.85" type="number" step="0.01" required />
                </div>
                <div className="flex justify-end pt-4">
                    <button type="submit" className="w-full sm:w-auto px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-semibold">Save Item</button>
                </div>
            </form>
        );
    }

    function ExpenseEditor({ expense, onSave, onBack, catalogue }) {
        const [description, setDescription] = React.useState(expense?.description || "");
        const [category, setCategory] = React.useState(expense?.category || "");
        const [amount, setAmount] = React.useState(expense?.amount || "");
        const [fileName, setFileName] = React.useState(expense?.receipt?.name || "");

        const handleCatalogueSelect = (e) => {
            const selectedId = e.target.value;
            if (!selectedId) return;
            const item = catalogue.find(c => c.id === parseInt(selectedId));
            if (item) {
                setDescription(item.name);
                setCategory(item.category);
                setAmount(item.price);
            }
        }

        const handleSubmit = (e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            const receiptFile = formData.get('receipt') as File;
            onSave({
                date: formData.get('date') as string,
                description,
                category,
                amount: parseFloat(amount as string),
                receipt: receiptFile.size > 0 ? receiptFile : expense?.receipt
            });
            onBack();
        };
        
        return (
            <div className="bg-white p-6 rounded-xl shadow-lg max-w-2xl mx-auto">
                <div className="flex items-center gap-4 mb-6">
                    <button onClick={onBack} className="text-slate-500 hover:text-slate-900"><ArrowLeft size={20}/></button>
                    <h2 className="text-2xl font-bold text-slate-800">{expense ? 'Edit Expense' : 'New Expense'}</h2>
                </div>
                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div>
                        <label className="form-label" htmlFor="catalogue-select">Select from Catalogue (Optional)</label>
                        <select id="catalogue-select" className="form-input" onChange={handleCatalogueSelect}>
                            <option value="">-- Or enter manually --</option>
                            {catalogue.map(item => <option key={item.id} value={item.id}>{item.name}</option>)}
                        </select>
                    </div>
                    <div className="h-px bg-slate-200"></div>
                    <div>
                        <label className="form-label" htmlFor="exp-date">Date</label>
                        <input id="exp-date" name="date" type="date" className="form-input" defaultValue={expense?.date || new Date().toISOString().split("T")[0]} required/>
                    </div>
                    <div>
                        <label className="form-label" htmlFor="exp-desc">Description</label>
                        <input id="exp-desc" name="description" className="form-input" value={description} onChange={e => setDescription(e.target.value)} placeholder="Expense Description" required/>
                    </div>
                    <div>
                        <label className="form-label" htmlFor="exp-cat">Category</label>
                        <select id="exp-cat" name="category" className="form-input" value={category} onChange={e => setCategory(e.target.value)} required>
                            <option value="">Select Category...</option>
                            <option>Travel</option>
                            <option>Materials</option>
                            <option>Equipment</option>
                            <option>Insurance</option>
                            <option>Other</option>
                        </select>
                    </div>
                    <div>
                        <label className="form-label" htmlFor="exp-amount">Amount</label>
                        <input id="exp-amount" name="amount" className="form-input" value={amount} onChange={e => setAmount(e.target.value as any)} placeholder="Amount ($)" type="number" step="0.01" required/>
                    </div>
                    <div>
                        <label className="form-label" htmlFor="exp-receipt">Receipt</label>
                        <label htmlFor="exp-receipt" className="form-input flex items-center justify-between text-slate-500 cursor-pointer">
                            <span className="flex items-center gap-2">
                            <Upload size={16} />
                            <span>{fileName || "Upload File"}</span>
                            </span>
                            {fileName && <button type="button" onClick={() => setFileName("")} className="text-red-500 hover:text-red-700"><X size={16}/></button>}
                        </label>
                        <input id="exp-receipt" name="receipt" type="file" className="sr-only" onChange={(e) => setFileName(e.target.files?.[0]?.name || "")} />
                    </div>
                    <div className="flex justify-end pt-4">
                        <button type="submit" className="w-full sm:w-auto px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-semibold">Save Expense</button>
                    </div>
                </form>
            </div>
        );
    }

    // --- NEW INVOICE BUILDER AND TEMPLATE EDITOR ---
    const InvoiceTemplateEditor = ({ onSave, onBack }) => {
        const [state, setState] = React.useState({
            logo: "https://create.onlineinvoices.com/default-logo.png",
            businessInfo: "[Business Name]\nABN: XX XXX XXX XXX\n[Street Address]\n[Suburb, State, Postcode]\nPhone: [Number]\nEmail: [Email]",
            invoiceTitle: "Abn Invoice Template",
            billToLabel: "Bill To",
            clientInfo: "[Client Name]\n[Street Address]\n[Suburb, State, Postcode]\nPhone: [Number]\nEmail: [Email]\nAccount #: [Number]",
            fields: [
                { id: 1, label: 'Invoice Number', value: '2001321' },
                { id: 2, label: 'Date', value: '6/24/2025' },
            ],
            items: [
                { id: 1, description: 'Labor Charges', qty: '5', unit_price: '100', amount: '$500.00' },
                { id: 2, description: 'Materials or Supplies', qty: '3', unit_price: '20', amount: '$60.00' },
                { id: 3, description: 'Travel Costs', qty: '1', unit_price: '25', amount: '$25.00' },
                { id: 4, description: 'GST Amount', qty: '7', unit_price: '50', amount: '$350.00' }
            ],
            notes: "This invoice includes GST and requires payment within [X] days - please quote invoice number when making payment.",
            totals: {
                subtotalLabel: "Subtotal",
                subtotal: "$935.00",
                totalLabel: "Total",
                total: "$935.00",
                paidLabel: "Paid Amount",
                paid: "",
                balanceDueLabel: "Balance Due",
                balanceDue: "$935.00"
            }
        });

        const handleStateChange = (key, value) => setState(p => ({ ...p, [key]: value }));
        const handleFieldChange = (index, key, value) => {
            const newFields = [...state.fields];
            newFields[index][key] = value;
            setState(p => ({ ...p, fields: newFields }));
        };
        const handleItemChange = (index, key, value) => {
            const newItems = [...state.items];
            newItems[index][key] = value;
            setState(p => ({ ...p, items: newItems }));
        };
        const handleTotalChange = (key, value) => setState(p => ({...p, totals: {...p.totals, [key]: value}}));

        const addField = () => {
            setState(p => ({
                ...p,
                fields: [...p.fields, { id: Date.now(), label: '[ADD MORE]', value: '' }]
            }));
        };

        const addItem = () => {
            setState(p => ({
                ...p,
                items: [...p.items, { id: Date.now(), description: '', qty: '1', unit_price: '0', amount: '$0.00' }]
            }))
        };
        
        const removeItem = (id) => {
            setState(p => ({...p, items: p.items.filter(item => item.id !== id)}))
        }
        
        const handleLogoUpload = (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    handleStateChange('logo', event.target.result as string);
                };
                reader.readAsDataURL(file);
            }
        };


        return (
            <div className="bg-slate-100 p-8">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-white p-2 rounded-t-lg border-b shadow-sm flex items-center gap-1">
                        <select className="form-input text-sm w-28"><option>12pt</option></select>
                        <button className="p-2 hover:bg-slate-100 rounded"><Palette size={18}/></button>
                        <button className="p-2 hover:bg-slate-100 rounded"><div className="w-5 h-5 bg-yellow-200 border border-slate-300 rounded"></div></button>
                        <select className="form-input text-sm w-28"><option>Formats</option></select>
                        <button className="p-2 hover:bg-slate-100 rounded"><Bold size={18}/></button>
                        <button className="p-2 hover:bg-slate-100 rounded"><Italic size={18}/></button>
                        <button className="p-2 hover:bg-slate-100 rounded"><List size={18}/></button>
                        <button className="p-2 hover:bg-slate-100 rounded"><Outdent size={18}/></button>
                        <button className="p-2 hover:bg-slate-100 rounded"><Indent size={18}/></button>
                    </div>
                    <div className="bg-white p-8 shadow-lg">
                        <table className="w-full mb-6">
                            <tbody>
                                <tr>
                                    <td className="align-top w-1/2">
                                        <img src={state.logo} className="h-24" alt="logo"/>
                                        <input type="file" id="logo-upload" className="hidden" onChange={handleLogoUpload} />
                                        <button onClick={() => document.getElementById('logo-upload').click()} className="text-xs text-blue-600 hover:underline">Change Logo</button>
                                    </td>
                                    <td className="align-top w-1/2 text-right">
                                        <textarea value={state.businessInfo} onChange={e => handleStateChange('businessInfo', e.target.value)} className="form-input text-right h-32" />
                                        <input type="text" value={state.invoiceTitle} onChange={e => handleStateChange('invoiceTitle', e.target.value)} className="form-input text-right text-2xl font-bold mt-2" />
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <div className="border-t-2 border-double border-black pt-8">
                            <table className="w-full">
                                <tbody>
                                    <tr>
                                        <td className="w-1/2 align-top">
                                            <input value={state.billToLabel} onChange={e=>handleStateChange('billToLabel', e.target.value)} className="font-bold form-input mb-2" />
                                            <textarea value={state.clientInfo} onChange={e=>handleStateChange('clientInfo', e.target.value)} className="form-input h-28" />
                                        </td>
                                        <td className="w-1/2 align-top">
                                            {state.fields.map((field, index) => (
                                                <div key={field.id} className="flex items-center gap-2 justify-end mb-2">
                                                    <input value={field.label} onChange={e=>handleFieldChange(index, 'label', e.target.value)} className="form-input font-bold text-right"/>
                                                    <input value={field.value} onChange={e=>handleFieldChange(index, 'value', e.target.value)} className="form-input text-right"/>
                                                </div>
                                            ))}
                                            <button onClick={addField} className="text-xs float-right text-blue-600 hover:underline mt-1">+ Add Custom Field</button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <table className="w-full mt-8 border-collapse border border-slate-400">
                            <thead>
                                <tr className="bg-slate-200">
                                    <th className="p-2 border border-slate-400 text-left">Description</th>
                                    <th className="p-2 border border-slate-400 text-left w-24">Quantity</th>
                                    <th className="p-2 border border-slate-400 text-left w-32">Unit Price</th>
                                    <th className="p-2 border border-slate-400 text-left w-32">Amount</th>
                                    <th className="w-10"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {state.items.map((item, index) => (
                                    <tr key={item.id}>
                                        <td className="p-1"><textarea value={item.description} onChange={e=>handleItemChange(index, 'description', e.target.value)} className="form-input"/></td>
                                        <td className="p-1"><input value={item.qty} onChange={e=>handleItemChange(index, 'qty', e.target.value)} className="form-input"/></td>
                                        <td className="p-1"><input value={item.unit_price} onChange={e=>handleItemChange(index, 'unit_price', e.target.value)} className="form-input"/></td>
                                        <td className="p-1"><input value={item.amount} onChange={e=>handleItemChange(index, 'amount', e.target.value)} className="form-input"/></td>
                                        <td className="text-center"><button onClick={() => removeItem(item.id)} className="text-red-500"><Trash2 size={16}/></button></td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot>
                                <tr>
                                    <td className="p-2" colSpan="5">
                                        <button onClick={addItem} className="px-3 py-1 bg-indigo-600 text-white rounded-md text-sm">+ Add Line</button>
                                    </td>
                                </tr>
                                <tr>
                                    <td colSpan="2"></td>
                                    <td className="p-1"><input value={state.totals.subtotalLabel} onChange={e=>handleTotalChange('subtotalLabel', e.target.value)} className="form-input font-bold text-right" /></td>
                                    <td className="p-1"><input value={state.totals.subtotal} onChange={e=>handleTotalChange('subtotal', e.target.value)} className="form-input" /></td>
                                </tr>
                                <tr>
                                    <td colSpan="2"></td>
                                    <td className="p-1"><input value={state.totals.totalLabel} onChange={e=>handleTotalChange('totalLabel', e.target.value)} className="form-input font-bold text-right" /></td>
                                    <td className="p-1"><input value={state.totals.total} onChange={e=>handleTotalChange('total', e.target.value)} className="form-input" /></td>
                                </tr>
                                <tr>
                                    <td colSpan="2"></td>
                                    <td className="p-1"><input value={state.totals.paidLabel} onChange={e=>handleTotalChange('paidLabel', e.target.value)} className="form-input font-bold text-right" /></td>
                                    <td className="p-1"><input value={state.totals.paid} onChange={e=>handleTotalChange('paid', e.target.value)} className="form-input" /></td>
                                </tr>
                                <tr>
                                    <td colSpan="2"></td>
                                    <td className="p-1"><input value={state.totals.balanceDueLabel} onChange={e=>handleTotalChange('balanceDueLabel', e.target.value)} className="form-input font-bold text-right" /></td>
                                    <td className="p-1"><input value={state.totals.balanceDue} onChange={e=>handleTotalChange('balanceDue', e.target.value)} className="form-input" /></td>
                                </tr>
                            </tfoot>
                        </table>

                        <div className="mt-12">
                            <textarea value={state.notes} onChange={e=>handleStateChange('notes', e.target.value)} className="form-input h-24" />
                        </div>
                    </div>
                    <div className="max-w-4xl mx-auto mt-6 flex justify-end gap-2">
                        <button onClick={onBack} className="px-6 py-2 bg-slate-200 text-slate-800 rounded-lg hover:bg-slate-300 font-semibold">Cancel</button>
                        <button onClick={() => onSave(state)} className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-semibold">Save Template</button>
                    </div>
                </div>
            </div>
        );
    };

    const InvoiceBuilder = ({ onBack, onSave, invoice: initialInvoiceData, clients, services, workerInfo, templates, openPreviewModal }) => {
        const isNewInvoice = !initialInvoiceData;

        const [invoice, setInvoice] = React.useState(() => {
            if (isNewInvoice) {
                return {
                    id: Date.now(),
                    client: '',
                    date: new Date().toISOString().split('T')[0],
                    items: [{ id: Date.now(), description: "", qty: 1, unit_price: 0 }],
                    status: 'draft',
                };
            }
            return { ...initialInvoiceData };
        });

        const [selectedClientId, setSelectedClientId] = React.useState(() => {
            if (isNewInvoice || !initialInvoiceData.client) return null;
            const client = clients.find(c => c.name === initialInvoiceData.client);
            return client ? client.id : null;
        });

        const selectedClient = React.useMemo(() => clients.find(c => c.id === selectedClientId), [clients, selectedClientId]);

        const calculateTotals = (items) => {
            const subtotal = items.reduce((acc, item) => acc + (item.qty * item.unit_price), 0);
            const gst = subtotal * 0.10;
            const total = subtotal + gst;
            return {
                subtotal: subtotal.toFixed(2),
                gst: gst.toFixed(2),
                total: total.toFixed(2)
            };
        };

        const handleClientChange = (e) => {
            const newClientId = Number(e.target.value);
            setSelectedClientId(newClientId);
            const clientName = clients.find(c => c.id === newClientId)?.name || '';
            setInvoice(prev => ({...prev, client: clientName}));
        };

        const handleItemChange = (index, field, value) => {
            setInvoice(prev => {
                const newItems = [...prev.items];
                const currentItem = { ...newItems[index] };

                if (field === 'description') {
                    currentItem.description = value;
                    const service = services.find(s => s.name === value);
                    if (service) {
                        currentItem.unit_price = parseFloat(service.rate) || 0;
                    }
                } else if (field === 'qty') {
                    currentItem.qty = parseFloat(value) || 0;
                } else if (field === 'unit_price') {
                    currentItem.unit_price = parseFloat(value) || 0;
                }
                
                newItems[index] = currentItem;
                return { ...prev, items: newItems };
            });
        };

        const addItem = () => {
            setInvoice(prev => ({
                ...prev,
                items: [...prev.items, { id: Date.now(), description: "", qty: 1, unit_price: 0 }]
            }));
        };
        
        const removeItem = (index) => {
            setInvoice(prev => ({
                ...prev,
                items: prev.items.filter((_, i) => i !== index)
            }));
        };

        const handleSave = () => {
            onSave(invoice);
            onBack();
        };

        const handlePreview = () => {
            const clientTemplateId = selectedClient?.templateId;
            const templateToUse = templates.find(t => t.id === clientTemplateId) || templates[0];

            const totals = calculateTotals(invoice.items);

            const previewData = {
                ...templateToUse,
                from: `${workerInfo.tradingName}\n${workerInfo.address}\nABN: ${workerInfo.abn}`,
                to: selectedClient ? `${selectedClient.name}\n${selectedClient.customFields?.find(f=>f.key === 'Address')?.value || ''}\n${selectedClient.email}` : '[Select a Client]',
                fields: templateToUse.fields.map(field => {
                    if (field.label.includes('Invoice #')) return { ...field, value: invoice.id };
                    if (field.label.includes('Date')) return { ...field, value: new Date(invoice.date).toLocaleDateString('en-AU') };
                    return field;
                }),
                items: invoice.items.map(item => ({
                    id: item.id,
                    desc: item.description,
                    qty: item.qty.toString(),
                    unit_price: item.unit_price.toFixed(2),
                    amount: (item.qty * item.unit_price).toFixed(2),
                })),
                totals: templateToUse.totals.map(total => {
                    if (total.label.toLowerCase().includes('subtotal')) return { ...total, value: totals.subtotal };
                    if (total.label.toLowerCase().includes('gst')) return { ...total, value: totals.gst };
                    if (total.label.toLowerCase().includes('total')) return { ...total, value: totals.total };
                    if (total.label.toLowerCase().includes('balance')) return { ...total, value: totals.total }; // Assuming paid is 0 for new invoice
                    return total;
                }),
            };
            openPreviewModal(previewData);
        };

        return (
            <div className="bg-white p-6 rounded-xl shadow-lg">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                        <button onClick={onBack} className="text-slate-500 hover:text-slate-900"><ArrowLeft size={20}/></button>
                        <h2 className="text-2xl font-bold text-slate-800">{isNewInvoice ? 'New Invoice' : `Edit Invoice #${invoice.id}`}</h2>
                    </div>
                    <div className="flex gap-2">
                        <button onClick={handlePreview} className="px-4 py-2 bg-slate-200 text-slate-800 rounded-lg hover:bg-slate-300 font-semibold text-sm flex items-center gap-2">
                            <Eye size={16}/> Preview
                        </button>
                        <button onClick={handleSave} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-semibold text-sm">
                        Save Invoice
                        </button>
                    </div>
                </div>

                <div className="space-y-6">
                    <div>
                        <label htmlFor="client-select" className="form-label">Client</label>
                        <select id="client-select" onChange={handleClientChange} value={selectedClientId || ''} className="form-input">
                            <option value="" disabled>-- Select a Client --</option>
                            {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                    </div>

                    <div className="border-t pt-4">
                        <h3 className="font-semibold text-lg mb-2">Invoice Items</h3>
                        <table className="w-full">
                            <thead>
                                <tr className="border-b">
                                    <th className="text-left py-2 font-medium text-slate-500 text-sm w-1/2">Description</th>
                                    <th className="text-right py-2 font-medium text-slate-500 text-sm w-1/6">Qty</th>
                                    <th className="text-right py-2 font-medium text-slate-500 text-sm w-1/6">Unit Price</th>
                                    <th className="text-right py-2 font-medium text-slate-500 text-sm w-1/6">Amount</th>
                                    <th className="w-12"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {invoice.items.map((item, index) => (
                                    <tr key={item.id} className="border-b">
                                        <td className="py-2">
                                            <select 
                                                value={item.description} 
                                                onChange={(e) => handleItemChange(index, 'description', e.target.value)} 
                                                className="form-input"
                                                disabled={!selectedClientId}
                                            >
                                                <option value="">{selectedClientId ? "Select service..." : "Select client first"}</option>
                                                {services.filter(s => selectedClient?.services.includes(s.name)).map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                                            </select>
                                        </td>
                                        <td className="py-2 pl-2"><input type="number" value={item.qty} onChange={(e) => handleItemChange(index, 'qty', e.target.value)} className="form-input text-right"/></td>
                                        <td className="py-2 pl-2"><input type="number" step="0.01" value={item.unit_price} onChange={(e) => handleItemChange(index, 'unit_price', e.target.value)} className="form-input text-right"/></td>
                                        <td className="py-2 pl-2 text-right text-slate-800 pr-4">${(item.qty * item.unit_price).toFixed(2)}</td>
                                        <td className="py-2 text-center"><button onClick={() => removeItem(index)} className="p-2 text-slate-400 hover:text-red-500"><Trash2 size={16}/></button></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <button type="button" onClick={addItem} className="flex items-center gap-2 px-3 py-1.5 bg-indigo-100 text-indigo-700 rounded-md hover:bg-indigo-200 text-sm font-semibold mt-3">
                            <Plus size={16}/> Add Line
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const InvoicePreviewComponent = ({ template }) => {
        if (!template) return null;

        return (
            <div className="bg-white p-6 rounded-xl shadow-lg max-w-4xl mx-auto">
                {template.logo && template.show?.logo && (
                    <img src={template.logo} alt="logo" className="h-24 mb-4" />
                )}
                <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: template.font }}>
                    {template.invoiceTitle}
                </h2>
                <div className="grid grid-cols-2 gap-6 mb-6">
                    {template.show?.from && (
                        <pre className="whitespace-pre-wrap text-sm">{template.from}</pre>
                    )}
                    {template.show?.to && (
                        <pre className="whitespace-pre-wrap text-sm text-right">{template.to}</pre>
                    )}
                </div>
                <table className="w-full border border-slate-300 mb-6 text-sm">
                    <thead className="bg-slate-100">
                        <tr>
                            <th className="border p-2 text-left">Description</th>
                            <th className="border p-2 text-right">Qty</th>
                            <th className="border p-2 text-right">Unit Price</th>
                            <th className="border p-2 text-right">Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {template.items.map(item => (
                            <tr key={item.id}>
                                <td className="border p-2">{item.desc}</td>
                                <td className="border p-2 text-right">{item.qty}</td>
                                <td className="border p-2 text-right">{item.unit_price}</td>
                                <td className="border p-2 text-right">{item.amount}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="space-y-1 text-right text-sm">
                    {template.totals.map((t, idx) => (
                        t.enabled && (
                            <div key={idx} className="flex justify-end gap-2">
                                <span>{t.label}</span>
                                <span className="font-semibold">{t.value}</span>
                            </div>
                        )
                    ))}
                </div>
                {template.notes && template.show?.notes && (
                    <p className="mt-6 whitespace-pre-wrap text-sm">{template.notes}</p>
                )}
                {template.footer && template.show?.footer && (
                    <p className="mt-6 text-xs text-center whitespace-pre-wrap text-slate-500">
                        {template.footer}
                    </p>
                )}
            </div>
        );
    };

    // --- TAB COMPONENTS ---

    const ShiftsTab = ({ shifts, clients, setViewingShift, setActiveView, isWidget = false, listDisplayCount = 10 }) => {
        const [filter, setFilter] = React.useState({ client: 'all', search: '' });
        
        const handleFilterChange = (e) => {
            const { name, value } = e.target;
            setFilter(prev => ({...prev, [name]: value}));
        }

        const filteredShifts = React.useMemo(() => {
            return shifts
                .filter(shift => filter.client === 'all' || shift.client === filter.client)
                .filter(shift => shift.notes.toLowerCase().includes(filter.search.toLowerCase()) || shift.service.toLowerCase().includes(filter.search.toLowerCase()))
                .sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        }, [shifts, filter]);

        const displayShifts = isWidget ? filteredShifts.slice(0, listDisplayCount) : filteredShifts;

        return (
            <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-slate-800">{isWidget ? 'Recent Shifts' : 'All Shifts'}</h2>
                </div>
                {!isWidget && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div className="md:col-span-2 relative">
                            <input type="text" name="search" placeholder="Search notes or services..." onChange={handleFilterChange} className="form-input pl-10"/>
                            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        </div>
                        <div>
                            <select name="client" onChange={handleFilterChange} className="form-input">
                                <option value="all">All Clients</option>
                                {clients.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                            </select>
                        </div>
                    </div>
                )}
                <div className="space-y-2 max-h-[70vh] overflow-y-auto pr-2">
                    {displayShifts.map(shift => (
                        <button key={shift.id} onClick={() => { setViewingShift(shift); setActiveView('details'); }} className="w-full text-left p-3 rounded-lg hover:bg-slate-50 flex justify-between items-center">
                            <div>
                                <p className="font-semibold text-slate-700">{shift.service} <span className="font-normal">for</span> {shift.client}</p>
                                <p className="text-sm text-slate-500">{new Date(shift.date).toLocaleDateString('en-AU', { weekday: 'short', day: 'numeric', month: 'short' })} &middot; {shift.startTime} - {shift.endTime}</p>
                            </div>
                            <View size={16} className="text-slate-400"/>
                        </button>
                    ))}
                    {displayShifts.length === 0 && <p className="text-center text-slate-500 py-8">No shifts found.</p>}
                </div>
            </div>
        );
    };

    const InvoicesTab = ({ invoices, expenses, onArchive, selectedFY, setSelectedFY, setEditingInvoice, setActiveView, onUpdateStatus, openSendModal, listDisplayCount }) => {
        const [filter, setFilter] = React.useState({ status: 'all', client: 'all' });

        const handleFilterChange = (e) => {
            const { name, value } = e.target;
            setFilter(prev => ({ ...prev, [name]: value }));
        };

        const financialYears = React.useMemo(() => {
            const years = new Set(invoices.map(i => getFinancialYear(i.date)));
            return Array.from(years).sort().reverse();
        }, [invoices]);

        const filteredData = React.useMemo(() => {
            const inv = invoices.filter(i => getFinancialYear(i.date) === selectedFY)
                .filter(i => filter.status === 'all' || i.status === filter.status)
                .filter(i => filter.client === 'all' || i.client === filter.client)
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
            const exp = expenses.filter(e => getFinancialYear(e.date) === selectedFY);
            return { invoices: inv, expenses: exp };
        }, [invoices, expenses, selectedFY, filter]);

        const stats = React.useMemo(() => {
            const income = filteredData.invoices
                .filter(i => i.status === 'paid')
                .reduce((sum, inv) => sum + inv.items.reduce((s, it) => s + it.qty * it.unit_price, 0), 0);
            const expenses = filteredData.expenses.reduce((sum, exp) => sum + exp.amount, 0);
            return {
                income: income.toFixed(2),
                expenses: expenses.toFixed(2),
                profit: (income - expenses).toFixed(2),
            };
        }, [filteredData]);
        
        const uniqueClientsInFY = Array.from(new Set(filteredData.invoices.map(i => i.client)));

        return (
            <div className="space-y-8">
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800">Invoices & Finance</h2>
                    </div>
                    <div className="flex items-center gap-2">
                        <select value={selectedFY} onChange={(e) => setSelectedFY(e.target.value)} className="form-input">
                            {financialYears.map(fy => <option key={fy} value={fy}>FY {fy}</option>)}
                        </select>
                        <button onClick={() => onArchive(selectedFY)} className="p-2 text-slate-500 hover:text-indigo-600" title={`Archive FY ${selectedFY}`}>
                        <Archive size={18}/>
                        </button>
                    </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div className="bg-green-100 p-5 rounded-xl"><p className="text-sm text-green-800">Total Income</p><p className="text-3xl font-bold text-green-900">${stats.income}</p></div>
                    <div className="bg-red-100 p-5 rounded-xl"><p className="text-sm text-red-800">Total Expenses</p><p className="text-3xl font-bold text-red-900">${stats.expenses}</p></div>
                    <div className="bg-blue-100 p-5 rounded-xl"><p className="text-sm text-blue-800">Profit</p><p className="text-3xl font-bold text-blue-900">${stats.profit}</p></div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm">
                    <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-4">
                        <h3 className="text-xl font-bold text-slate-800">Invoices for FY {selectedFY}</h3>
                        <div className="flex items-center gap-2">
                            <button onClick={openSendModal} className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-semibold text-sm flex items-center gap-2"><Send size={16}/> Send Drafts</button>
                            <button onClick={() => { setEditingInvoice(undefined); setActiveView('editor'); }} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-semibold text-sm flex items-center gap-2"><Plus size={16}/> New Invoice</button>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <select name="status" onChange={handleFilterChange} className="form-input">
                            <option value="all">All Statuses</option>
                            <option value="draft">Draft</option>
                            <option value="sent">Sent</option>
                            <option value="paid">Paid</option>
                        </select>
                        <select name="client" onChange={handleFilterChange} className="form-input">
                            <option value="all">All Clients</option>
                            {uniqueClientsInFY.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>
                    <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-2">
                        {filteredData.invoices.map(inv => (
                            <div key={inv.id} className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-slate-50">
                                <button onClick={() => { setEditingInvoice(inv); setActiveView('editor'); }} className="flex-grow text-left">
                                    <p className="font-semibold text-slate-700">Invoice #{inv.id} - {inv.client}</p>
                                    <p className="text-sm text-slate-500">{new Date(inv.date).toLocaleDateString('en-AU', {day: 'numeric', month: 'short', year: 'numeric'})}</p>
                                </button>
                                <div className="flex items-center gap-4">
                                    <p className="font-bold text-slate-800 text-lg">${inv.items.reduce((s, it) => s + it.qty * it.unit_price, 0).toFixed(2)}</p>
                                    <select value={inv.status} onChange={(e) => onUpdateStatus(inv.id, e.target.value)} className={`text-xs font-semibold rounded-full border-none focus:ring-0 ${ inv.status === 'draft' ? 'bg-amber-100 text-amber-800' : inv.status === 'sent' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
                                        <option value="draft">draft</option>
                                        <option value="sent">sent</option>
                                        <option value="paid">paid</option>
                                    </select>
                                </div>
                            </div>
                        ))}
                        {filteredData.invoices.length === 0 && <p className="text-center text-slate-500 py-8">No invoices match your filters.</p>}
                    </div>
                </div>
            </div>
        );
    };


    // --- Main Dashboard Component ---
    export default function WorkerDashboard() {
    const [activeTab, setActiveTab] = React.useState("overview");
    const [activeView, setActiveView] = React.useState("list");
    
    // Unified modal state
    const [modalState, setModalState] = React.useState<{isOpen: boolean, view: string | null, data: any}>({ isOpen: false, view: null, data: null });
    const [quillLoaded, setQuillLoaded] = React.useState(false);
    
    // Data state
    const [workerInfo, setWorkerInfo] = React.useState<WorkerInfo>(initialWorkerInfo);
    const [services, setServices] = React.useState<Service[]>(initialServices);
    const [clients, setClients] = React.useState<Client[]>(initialClients);
    const [invoices, setInvoices] = React.useState<Invoice[]>(initialInvoices);
    const [invoiceTemplates, setInvoiceTemplates] = React.useState<InvoiceTemplate[]>(initialInvoiceTemplates);
    const [expenses, setExpenses] = React.useState<Expense[]>(initialExpenses);
    const [recurringExpenses, setRecurringExpenses] = React.useState<RecurringExpense[]>(initialRecurringExpenses);
    const [shifts, setShifts] = React.useState<Shift[]>(initialShifts);
    
    const [archivedInvoices, setArchivedInvoices] = React.useState<Invoice[]>([]);
    const [archivedExpenses, setArchivedExpenses] = React.useState<Expense[]>([]);

    // UI Customization State
    const [uiSettings, setUiSettings] = React.useState({
        navItems: {
            overview: { label: 'Overview', visible: true},
            invoices: { label: 'Invoices', visible: true},
            expenses: { label: 'Expenses', visible: true},
            clients: { label: 'Clients', visible: true},
            services: { label: 'Services', visible: true},
            shifts: { label: 'Shifts', visible: true},
        },
        quickActions: {
            newClient: { title: "New Client", icon: <User size={24} />, visible: true, onClick: () => openModal('client')},
            logShift: { title: "Log Shift", icon: <Clock size={24} />, visible: true, onClick: () => openModal('shift') },
            newService: { title: "New Service", icon: <ClipboardList size={24} />, visible: true, onClick: () => openModal('service') },
            newInvoice: { title: "New Invoice", icon: <FileSignature size={24} />, visible: true, onClick: () => { setActiveTab('invoices'); setEditingInvoice(undefined); setActiveView('editor'); } },
        },
        overviewWidgets: { 
            stats: { title: 'Key Metrics', component: 'Stats', visible: true, pinned: false }, 
            quickActions: { title: 'Quick Actions', component: 'QuickActions', visible: true, pinned: false },
            main: { title: 'Dashboard', component: 'Main', visible: true, pinned: false } 
        },
        listDisplayCount: 10,
    });

    const [widgetOrder, setWidgetOrder] = React.useState(['stats', 'quickActions', 'main']);
    const [quickActionsOrder, setQuickActionsOrder] = React.useState(Object.keys(uiSettings.quickActions));
    
    const dragItem = React.useRef<any>(null);
    const dragOverItem = React.useRef<any>(null);

    // Editing state (used for full-page editors)
    const [editingClient, setEditingClient] = React.useState<Client | undefined>();
    const [editingService, setEditingService] = React.useState<Service | undefined>();
    const [editingExpense, setEditingExpense] = React.useState<Expense | undefined>();
    const [editingInvoice, setEditingInvoice] = React.useState<Invoice | undefined>();
    const [editingTemplate, setEditingTemplate] = React.useState<InvoiceTemplate | undefined>();
    const [viewingShift, setViewingShift] = React.useState<Shift | undefined>();

    const [selectedFY, setSelectedFY] = React.useState(getFinancialYear(new Date()));
    
    React.useEffect(() => {
        const loadScript = (src, id) => {
            return new Promise((resolve, reject) => {
                if(document.getElementById(id)) {
                    resolve(true);
                    return;
                }
                const script = document.createElement('script');
                script.src = src;
                script.id = id;
                script.onload = resolve;
                script.onerror = reject;
                document.head.appendChild(script);
            });
        }

        const loadQuill = async () => {
        try {
            const quillCss = document.createElement('link');
            quillCss.href = "https://cdn.quilljs.com/1.3.6/quill.snow.css";
            quillCss.rel = "stylesheet";
            quillCss.id = "quill-css";
            if(!document.getElementById('quill-css')) {
                document.head.appendChild(quillCss);
            }
            await loadScript("https://cdn.jsdelivr.net/npm/react-quill@2.0.0/dist/react-quill.js", "react-quill-script");
            setQuillLoaded(true);

        } catch (error) {
            console.error("Failed to load Quill script", error);
        }
        };
        
        loadQuill();
    }, []);


    const openModal = (view, data = null) => setModalState({ isOpen: true, view, data });
    const closeModal = () => {
        setModalState({ isOpen: false, view: null, data: null });
    }

    const handleSaveInvoice = (inv: Invoice) => {
        setInvoices((prev) => {
        const existing = prev.findIndex((d) => d.id === inv.id);
        if (existing >= 0) {
            return prev.map(p => p.id === inv.id ? inv : p);
        }
        return [inv, ...prev];
        });
    };
    
    const handleUpdateInvoiceStatus = (id, status) => {
        setInvoices(prev => prev.map(inv => inv.id === id ? {...inv, status} : inv));
    }
    
    const handleSaveWorkerProfile = (info) => {
        setWorkerInfo(prev => ({...prev, ...info}));
    }
    
    const handleSaveTemplate = (template: InvoiceTemplate) => {
        setInvoiceTemplates(prev => {
            const newTemplate = { ...template, id: template.id || Date.now() };
            const existing = prev.findIndex(t => t.id === newTemplate.id);
            if (existing > -1) {
                return prev.map(t => t.id === newTemplate.id ? newTemplate : t);
            }
            return [...prev, newTemplate];
        })
    }

    const handleSaveExpense = (exp: Omit<Expense, 'id'>) => {
        setExpenses(prev => {
            if (editingExpense) {
                return prev.map(p => p.id === editingExpense.id ? {...editingExpense, ...exp} : p);
            }
            return [{...exp, id: Date.now()}, ...prev];
        });
    };
    
    const handleSaveRecurringExpense = (item: Omit<RecurringExpense, 'id' | 'price'> & { price: number }) => {
        setRecurringExpenses(prev => {
            const editingItem = modalState.view === 'recurringExpense' ? modalState.data : null;
            if (editingItem) {
                return prev.map(p => p.id === editingItem.id ? {...editingItem, ...item} : p);
            }
            return [...prev, {...item, id: Date.now()}];
        });
        closeModal();
    };

    const handleSaveClient = (client: Omit<Client, 'id'>) => {
        setClients(prev => {
            const editingItem = modalState.view === 'client' ? modalState.data : editingClient;
            const clientToSave = editingItem ? { ...editingItem, ...client } : { ...client, id: Date.now() };
            if (editingItem) {
                return prev.map(p => p.id === editingItem.id ? clientToSave : p);
            }
            return [clientToSave, ...prev];
        });
    }

    const handleSaveService = (service: Omit<Service, 'id' | 'type'>) => {
        setServices(prev => {
            const editingItem = modalState.view === 'service' ? modalState.data : editingService;
            const serviceToSave = editingItem ? { ...editingItem, ...service, type: 'service' } : { ...service, id: Date.now(), type: 'service' };
            if (editingItem) {
                return prev.map(p => p.id === editingItem.id ? serviceToSave : p);
            }
            return [serviceToSave, ...prev];
        });
    }

    const handleLogShift = (shift: Omit<Shift, 'id'>) => {
        setShifts(prev => [...prev, {...shift, id: Date.now() }]);
        
        if (!workerInfo.automateInvoices) return;

        const service = services.find(s => s.name === shift.service);
        if (!service) return;

        const startTime = new Date(`${shift.date}T${shift.startTime}`);
        const endTime = new Date(`${shift.date}T${shift.endTime}`);
        const duration = (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60);

        if (duration <= 0) return;

        const newInvoiceItem: InvoiceItem = {
            id: Date.now(),
            description: shift.service,
            qty: parseFloat(duration.toFixed(2)),
            unit_price: parseFloat(service.rate)
        };

        setInvoices(prev => {
            const shiftDate = new Date(shift.date);
            const { invoiceFrequency, customInvoiceDays } = workerInfo;
            let periodStartDate = new Date(shiftDate);
            periodStartDate.setHours(0,0,0,0);

            switch(invoiceFrequency) {
                case 'Weekly':
                    const dayOfWeek = shiftDate.getDay();
                    periodStartDate.setDate(shiftDate.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1)); // Monday
                    break;
                case 'Fortnightly': {
                    const anchor = new Date('2020-01-06'); // A Monday
                    const diff = periodStartDate.getTime() - anchor.getTime();
                    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
                    const fortnightNumber = Math.floor(days / 14);
                    const startDay = new Date(anchor.getTime());
                    startDay.setDate(anchor.getDate() + fortnightNumber * 14);
                    periodStartDate = startDay;
                    break;
                }
                case 'Monthly':
                    periodStartDate.setDate(1);
                    break;
                case 'Custom': {
                    if(!customInvoiceDays || customInvoiceDays <= 0) break;
                    const anchor = new Date('2020-01-01').getTime();
                    const shiftTime = shiftDate.getTime();
                    const daysSinceAnchor = Math.floor((shiftTime - anchor) / (1000 * 3600 * 24));
                    const periodNumber = Math.floor(daysSinceAnchor / customInvoiceDays);
                    const periodStartMillis = anchor + periodNumber * customInvoiceDays * 1000 * 3600 * 24;
                    periodStartDate = new Date(periodStartMillis);
                    break;
                }
            }
            
            const existingInvoiceIndex = prev.findIndex(inv => 
                inv.client === shift.client && 
                inv.status === 'draft' &&
                new Date(inv.date) >= periodStartDate
            );
            
            if (existingInvoiceIndex > -1) {
                const updatedInvoices = [...prev];
                const invoiceToUpdate = { ...updatedInvoices[existingInvoiceIndex] };
                invoiceToUpdate.items = [...invoiceToUpdate.items, newInvoiceItem];
                updatedInvoices[existingInvoiceIndex] = invoiceToUpdate;
                return updatedInvoices;
            } else {
                const newInvoice: Invoice = {
                    id: Date.now(),
                    client: shift.client,
                    date: new Date().toISOString().split("T")[0],
                    items: [newInvoiceItem],
                    status: 'draft'
                };
                return [newInvoice, ...prev];
            }
        });
    };

    const handleArchiveFY = (fyToArchive: string) => {
        if (window.confirm(`Are you sure you want to archive all invoices and expenses for FY ${fyToArchive}? This cannot be undone.`)) {
            setInvoices(current => {
                const toArchive = current.filter(i => getFinancialYear(i.date) === fyToArchive);
                setArchivedInvoices(prev => [...prev, ...toArchive]);
                return current.filter(i => getFinancialYear(i.date) !== fyToArchive);
            });
            setExpenses(current => {
                const toArchive = current.filter(e => getFinancialYear(e.date) === fyToArchive);
                setArchivedExpenses(prev => [...prev, ...toArchive]);
                return current.filter(e => getFinancialYear(e.date) !== fyToArchive);
            });
            setSelectedFY(getFinancialYear(new Date()));
        }
    }

        const handleSendInvoices = (invoiceIds: number[]) => {
            setInvoices(prev => prev.map(inv => invoiceIds.includes(inv.id) ? { ...inv, status: 'sent' } : inv));
            console.log(`Sent invoices: ${invoiceIds.join(', ')}`);
        }
        
        const handleDragSort = (order, setOrder) => {
            if (!dragItem.current || !dragOverItem.current || dragItem.current.type !== dragOverItem.current.type) return;
            
            const _order = [...order];
            const draggedItemContent = _order.splice(dragItem.current.index, 1)[0];
            _order.splice(dragOverItem.current.index, 0, draggedItemContent);
            dragItem.current = null;
            dragOverItem.current = null;
            setOrder(_order);
        };

        const handlePinWidget = (key) => {
            setUiSettings(prev => ({
                ...prev,
                overviewWidgets: {
                    ...prev.overviewWidgets,
                    [key]: {
                        ...prev.overviewWidgets[key],
                        pinned: !prev.overviewWidgets[key].pinned
                    }
                }
            }));
        }

    const handleNavClick = (tabKey) => {
        setActiveTab(tabKey);
        setActiveView('list');
    }
    
    const renderModalContent = () => {
            const { view, data } = modalState;
            switch(view) {
                case 'profile':
                    return <ProfileEditor workerInfo={workerInfo} onSave={handleSaveWorkerProfile} onBack={closeModal} />;
                case 'client':
                    return <ClientEditor client={data} onSave={(client) => { handleSaveClient(client); closeModal(); }} onBack={closeModal} services={services} templates={invoiceTemplates} isModal />;
                case 'service':
                    return <ServiceEditor service={data} onSave={(service) => { handleSaveService(service); closeModal(); }} onBack={closeModal} isModal />;
                case 'recurringExpense':
                    return <RecurringExpenseEditor item={data} onSave={handleSaveRecurringExpense} onBack={closeModal} />;
                case 'shift':
                    return (
                        <form className="space-y-4" onSubmit={e => {
                            e.preventDefault();
                            const formData = new FormData(e.currentTarget);
                            handleLogShift({
                                client: formData.get('client') as string,
                                service: formData.get('service') as string,
                                date: formData.get('date') as string,
                                startTime: formData.get('startTime') as string,
                                endTime: formData.get('endTime') as string,
                                notes: formData.get('notes') as string,
                            });
                            closeModal();
                        }}>
                            <div>
                                <label className="form-label" htmlFor="shift-client">Client</label>
                                <select id="shift-client" name="client" className="form-input" required><option value="">Select Client...</option>{clients.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}</select>
                            </div>
                            <div>
                                <label className="form-label" htmlFor="shift-service">Service</label>
                                <select id="shift-service" name="service" className="form-input" required><option value="">Select Service...</option>{services.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}</select>
                            </div>
                            <div>
                                <label className="form-label" htmlFor="shift-date">Date</label>
                                <input id="shift-date" name="date" type="date" className="form-input" defaultValue={new Date().toISOString().split("T")[0]}/>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="form-label" htmlFor="shift-start">Start Time</label>
                                    <input id="shift-start" name="startTime" type="time" className="form-input" />
                                </div>
                                <div>
                                    <label className="form-label" htmlFor="shift-end">End Time</label>
                                    <input id="shift-end" name="endTime" type="time" className="form-input" />
                                </div>
                            </div>
                            <div>
                                <label className="form-label" htmlFor="shift-notes">Notes</label>
                                <textarea id="shift-notes" name="notes" className="form-input" placeholder="Shift notes..."></textarea>
                            </div>
                            <button type="submit" className="w-full py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-semibold">Log Shift & Add to Draft</button>
                        </form>
                    );
                case 'invoice-preview':
                    return <InvoicePreviewComponent template={data} />;
                default:
                    return null;
            }
        }


    const renderContent = () => {
        if (activeView === 'templates') {
        return (
            <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="flex items-center gap-4 mb-4">
                    <button onClick={() => { setActiveTab('overview'); setActiveView('list'); }} className="text-slate-500 hover:text-slate-900"><ArrowLeft size={20}/></button>
                    <h2 className="text-2xl font-bold text-slate-800">Document Templates</h2>
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-4">Invoice Templates</h3>
                {invoiceTemplates.map(t => 
                    <div key={t.id} className="flex items-center justify-between border-b py-3 last:border-b-0">
                        <div className="flex items-center gap-3">
                            <div className="w-4 h-4 rounded-full" style={{backgroundColor: t.accentColor}}></div>
                            <span>{t.name}</span>
                            <span className="text-xs text-slate-400">({t.font})</span>
                        </div>
                        <button onClick={() => { setEditingTemplate(t); setActiveView('template-editor'); }} className="p-2 text-slate-500 hover:text-indigo-600"><Edit size={16}/></button>
                    </div>
                )}
                <button onClick={() => { setEditingTemplate(undefined); setActiveView('template-editor'); }} className="w-full text-indigo-600 font-semibold py-3 rounded-lg hover:bg-indigo-50 mt-2 flex items-center justify-center gap-2">
                    <Plus size={16} /> New Invoice Template
                </button>
            </div>
        );
        }
        if (activeView === 'template-editor') {
            return <InvoiceTemplateEditor
                onSave={(template) => { handleSaveTemplate(template); setActiveView('templates'); }} 
                onBack={() => setActiveView('templates')}
            />
        }
        if (activeTab === 'invoices' && activeView === 'editor') {
            return <InvoiceBuilder 
                        onBack={() => setActiveView('list')} 
                        invoice={editingInvoice} 
                        onSave={handleSaveInvoice}
                        clients={clients}
                        services={services}
                        workerInfo={workerInfo}
                        templates={invoiceTemplates}
                        openPreviewModal={(data) => openModal('invoice-preview', data)}
                    />;
        }
        if (activeTab === 'clients' && activeView === 'editor') {
            return <ClientEditor client={editingClient} onSave={(client) => {handleSaveClient(client); setActiveView('list');}} onBack={() => setActiveView('list')} services={services} templates={invoiceTemplates}/>;
        }
        if (activeTab === 'services' && activeView === 'editor') {
            return <ServiceEditor service={editingService} onSave={(service) => {handleSaveService(service); setActiveView('list');}} onBack={() => setActiveView('list')} />;
        }
        if (activeTab === 'expenses' && activeView === 'editor') {
            return <ExpenseEditor expense={editingExpense} onSave={handleSaveExpense} onBack={() => setActiveView('list')} catalogue={recurringExpenses}/>;
        }
        if (activeTab === 'shifts' && activeView === 'details') {
            const associatedInvoice = invoices.find(inv => viewingShift && inv.client === viewingShift.client && new Date(inv.date) >= new Date(viewingShift.date));
            const associatedExpense = expenses.find(exp => viewingShift && exp.date === viewingShift.date);
            return (
                <div className="bg-white p-6 rounded-xl shadow-lg max-w-2xl mx-auto">
                    <div className="flex items-center gap-4 mb-6">
                        <button onClick={() => setActiveView('list')} className="text-slate-500 hover:text-slate-900"><ArrowLeft size={20}/></button>
                        <h2 className="text-2xl font-bold text-slate-800">Shift Details</h2>
                    </div>
                    {viewingShift && <div className="space-y-4">
                        <p><span className="font-semibold">Client:</span> {viewingShift.client}</p>
                        <p><span className="font-semibold">Service:</span> {viewingShift.service}</p>
                        <p><span className="font-semibold">Date:</span> {new Date(viewingShift.date).toLocaleDateString('en-AU', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                        <p><span className="font-semibold">Time:</span> {viewingShift.startTime} to {viewingShift.endTime}</p>
                        {viewingShift.notes && <p><span className="font-semibold">Notes:</span> {viewingShift.notes}</p>}
                        <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t">
                            {associatedInvoice && <button onClick={() => {setEditingInvoice(associatedInvoice); setActiveTab('invoices'); setActiveView('editor')}} className="flex items-center gap-2 text-blue-600 hover:underline"><LinkIcon size={16} /> View Invoice #{associatedInvoice.id}</button>}
                            {associatedExpense && <button onClick={() => {setEditingExpense(associatedExpense); setActiveTab('expenses'); setActiveView('editor')}} className="flex items-center gap-2 text-blue-600 hover:underline"><LinkIcon size={16}/> View Associated Expense</button>}
                        </div>
                    </div>}
                </div>
            )
        }


        // Default list views for each tab
        switch (activeTab) {
        case "overview":
            const sortedInvoices = [...invoices, ...archivedInvoices].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
            
            const StatsWidget = () => (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <StatCard title="Draft Invoices" value={invoices.filter(i => i.status === 'draft').length} icon={<FileText size={20}/>} onClick={handleNavClick} tabKey="invoices"/>
                    <StatCard title="Total Expenses (FY)" value={`$${expenses.filter(e => getFinancialYear(e.date) === selectedFY).reduce((sum, exp) => sum + exp.amount, 0).toFixed(2)}`} icon={<DollarSign size={20}/>} onClick={handleNavClick} tabKey="expenses"/>
                    <StatCard title="Active Clients" value={clients.length} icon={<Users size={20}/>} onClick={handleNavClick} tabKey="clients"/>
                </div>
            );

            const QuickActionsWidget = () => (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {quickActionsOrder.map((key, index) => {
                    const action = uiSettings.quickActions[key];
                    if (!action.visible) return null;
                    const draggableProps = uiSettings.overviewWidgets.quickActions.pinned ? {} : {
                        draggable: true,
                        onDragStart: () => (dragItem.current = {index, type: 'quickAction'}),
                        onDragEnter: () => (dragOverItem.current = {index, type: 'quickAction'}),
                        onDragEnd: () => handleDragSort(quickActionsOrder, setQuickActionsOrder),
                        onDragOver: e => e.preventDefault()
                    };
                    return <QuickActionButton key={key} title={action.title} icon={action.icon} onClick={action.onClick} draggableProps={draggableProps}/>
                    })}
                </div>
            );

            const MainWidget = () => (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <ShiftsTab shifts={shifts} clients={clients} setViewingShift={(shift) => { setViewingShift(shift); setActiveTab('shifts'); setActiveView('details'); }} setActiveView={setActiveView} isWidget={true} listDisplayCount={uiSettings.listDisplayCount} />
                    <div className="bg-white p-6 rounded-xl shadow-sm">
                        <h2 className="text-xl font-bold text-slate-800 mb-4">Recent Invoices</h2>
                        <div className="space-y-2 max-h-[26rem] overflow-y-auto pr-2">
                            {sortedInvoices.slice(0, uiSettings.listDisplayCount).map(inv => (
                            <button 
                                key={inv.id} 
                                onClick={() => { setEditingInvoice(inv); setActiveTab('invoices'); setActiveView('editor'); }}
                                className="w-full flex justify-between items-center p-3 rounded-lg hover:bg-slate-50 text-left"
                            >
                                <div>
                                    <p className="font-semibold text-slate-700">Invoice #{inv.id} - {inv.client}</p>
                                    <p className="text-sm text-slate-500">{new Date(inv.date).toLocaleDateString('en-AU', {day: 'numeric', month: 'short', year: 'numeric'})}</p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <p className="font-bold text-slate-800 text-lg">${inv.items.reduce((s, it) => s + it.qty * it.unit_price, 0).toFixed(2)}</p>
                                    <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${ inv.status === 'draft' ? 'bg-amber-100 text-amber-800' : inv.status === 'sent' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>{inv.status}</span>
                                </div>
                            </button>
                            ))}
                        </div>
                    </div>
                </div>
            );

            const overviewComponents = {
                Stats: StatsWidget,
                QuickActions: QuickActionsWidget,
                Main: MainWidget
            };
            
            return (
            <div className="space-y-8">
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800">Overview</h2>
                        <p className="text-slate-500 text-sm">Welcome back, {workerInfo.name.split(' ')[0]}!</p>
                    </div>
                    <button onClick={() => openModal('editOverview')} className="flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-800">
                        <LayoutDashboard size={16} />
                        Customize Overview
                    </button>
                </div>
                {widgetOrder.map((key, index) => {
                    const widget = uiSettings.overviewWidgets[key];
                    if (!widget.visible) return null;

                    const ComponentToRender = overviewComponents[widget.component];
                    if (!ComponentToRender) return null;
                    
                    const draggableProps = widget.pinned ? {} : {
                        draggable: true,
                        onDragStart: () => (dragItem.current = { index, type: 'widget' }),
                        onDragEnter: () => (dragOverItem.current = { index, type: 'widget' }),
                        onDragEnd: () => handleDragSort(widgetOrder, setWidgetOrder),
                        onDragOver: e => e.preventDefault(),
                    };

                    return (
                        <OverviewCard
                            key={key}
                            title={widget.title}
                            isPinned={widget.pinned}
                            onPin={() => handlePinWidget(key)}
                            draggableProps={draggableProps}
                        >
                            <ComponentToRender />
                        </OverviewCard>
                    )
                })}
            </div>
            );
        case "clients":
            return (
            <div className="bg-white p-6 rounded-xl shadow-sm space-y-4">
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800">Clients</h2>
                        <p className="text-sm text-slate-500">View and manage your client list.</p>
                    </div>
                    <button onClick={() => { setEditingClient(undefined); setActiveView('editor'); }}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-semibold shadow-sm flex items-center gap-2">
                    <Plus size={16}/> New Client
                    </button>
                </div>
                <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-2">
                {clients.map((c) => (
                <button key={c.id} onClick={() => { setEditingClient(c); setActiveView('editor'); }} className="w-full text-left border border-slate-200 rounded-lg p-4 transition-shadow hover:shadow-md group">
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="font-semibold text-slate-800">{c.name}</h3>
                            <p className="text-sm text-slate-500">{c.email} &middot; {c.phone}</p>
                            {c.schedule && c.schedule.length > 0 &&
                                <div className="mt-2 pt-2 border-t border-slate-100">
                                    <h4 className="text-xs font-bold text-slate-500 mb-1 flex items-center gap-1.5"><Calendar size={14} /> Schedule</h4>
                                    <div className="space-y-1">
                                        {c.schedule.slice(0,2).map(s => (
                                            <p key={s.id} className="text-xs text-slate-600">{s.day}, {s.startTime}-{s.endTime} ({s.service})</p>
                                        ))}
                                        {c.schedule.length > 2 && <p className="text-xs text-slate-400">...and {c.schedule.length - 2} more</p>}
                                    </div>
                                </div>
                            }
                        </div>
                        <div className="p-2 text-slate-400 group-hover:text-indigo-600"><Edit size={16}/></div>
                    </div>
                </button>
                ))}
                </div>
            </div>
            );
            case "services":
                return (
                <div className="bg-white p-6 rounded-xl shadow-sm space-y-4">
                    <div className="flex justify-between items-center">
                        <div>
                            <h2 className="text-2xl font-bold text-slate-800">Services</h2>
                            <p className="text-sm text-slate-500">Your offered services and their rates.</p>
                        </div>
                        <button onClick={() => { setEditingService(undefined); setActiveView('editor'); }}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-semibold shadow-sm flex items-center gap-2">
                        <Plus size={16}/> New Service
                        </button>
                    </div>
                    <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-2">
                    {services.map((s) => (
                    <button key={s.id} onClick={() => { setEditingService(s); setActiveView('editor'); }} className="w-full text-left border border-slate-200 rounded-lg p-4 flex justify-between items-center transition-shadow hover:shadow-md group">
                        <div>
                            <h3 className="font-semibold text-slate-800">{s.name}</h3>
                            <p className="text-sm text-slate-500">${s.rate} / {s.unit}</p>
                        </div>
                        <div className="p-2 text-slate-400 group-hover:text-indigo-600"><Edit size={16}/></div>
                    </button>
                    ))}
                    </div>
                </div>
                );
            case "expenses":
                return (
                    <div className="space-y-8">
                        <div className="bg-white p-6 rounded-xl shadow-sm">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h2 className="text-2xl font-bold text-slate-800">Recurring Expenses</h2>
                                    <p className="text-sm text-slate-500">Pre-define common expenses for faster logging.</p>
                                </div>
                                <button onClick={() => openModal('recurringExpense')}
                                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-semibold shadow-sm flex items-center gap-2">
                                <Plus size={16}/> New Item
                                </button>
                            </div>
                            <div className="space-y-3 mt-4 max-h-[40vh] overflow-y-auto pr-2">
                                {recurringExpenses.map(item => (
                                    <button key={item.id}
                                        onClick={() => openModal('recurringExpense', item)}
                                        className="w-full text-left border border-slate-200 rounded-lg p-4 flex justify-between items-center hover:shadow-md transition-shadow group"
                                    >
                                        <div>
                                            <p className="font-semibold">{item.name}</p>
                                            <p className="text-sm text-slate-500">{item.category}</p>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <p className="font-bold text-blue-600">${item.price.toFixed(2)}</p>
                                            <div className="p-2 text-slate-400 group-hover:text-indigo-600"><Edit size={16}/></div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow-sm space-y-4">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h2 className="text-2xl font-bold text-slate-800">Logged Expenses</h2>
                                    <p className="text-sm text-slate-500">Manage all your business expenses.</p>
                                </div>
                                <button onClick={() => { setEditingExpense(undefined); setActiveView('editor'); }}
                                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-semibold shadow-sm flex items-center gap-2">
                                <Plus size={16}/> Log Expense
                                </button>
                            </div>
                            <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
                                {[...expenses, ...archivedExpenses].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((exp) => (
                                    <button key={exp.id} onClick={() => { setEditingExpense(exp); setActiveView('editor'); }} className="w-full text-left border border-slate-200 rounded-lg p-4 flex justify-between items-center hover:bg-slate-50 transition-colors group">
                                        <div>
                                            <p className="font-semibold text-slate-800">{exp.description}</p>
                                            <p className="text-sm text-slate-500">{exp.category} &middot; {new Date(exp.date).toLocaleDateString()}</p>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <p className="font-bold text-blue-600 text-lg">${exp.amount.toFixed(2)}</p>
                                            <div className="p-2 text-slate-400 group-hover:text-indigo-600"><Edit size={16}/></div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                );
            case "invoices":
                return <InvoicesTab 
                    invoices={[...invoices, ...archivedInvoices]}
                    expenses={[...expenses, ...archivedExpenses]}
                    onArchive={handleArchiveFY}
                    selectedFY={selectedFY}
                    setSelectedFY={setSelectedFY}
                    setEditingInvoice={setEditingInvoice}
                    setActiveView={setActiveView}
                    onUpdateStatus={handleUpdateInvoiceStatus}
                    openSendModal={() => openModal('sendInvoices')}
                    listDisplayCount={uiSettings.listDisplayCount}
                />
            case "shifts":
                return <ShiftsTab 
                            shifts={shifts}
                            clients={clients}
                            setViewingShift={(shift) => { setViewingShift(shift); setActiveView('details'); }}
                            setActiveView={setActiveView}
                            listDisplayCount={uiSettings.listDisplayCount}
                        />
        default:
            return (
            <div className="text-slate-500 text-sm p-8 border-2 border-dashed border-slate-300 rounded-xl bg-white text-center">
                <p className="mb-2 font-semibold">This is the <strong>{activeTab}</strong> section.</p>
                <p>This part of the application is under construction.</p>
            </div>
            );
        }
    };


    return (
        <div className="min-h-screen bg-slate-50 font-sans">
        <nav className="bg-white/80 backdrop-blur-lg shadow-sm px-6 py-3 flex justify-between items-center sticky top-0 z-40 border-b border-slate-200">
            <h1 className="text-xl font-bold text-indigo-600">Da Foundry</h1>
            <div className="hidden md:flex items-center bg-slate-100 rounded-full p-1">
            {Object.entries(uiSettings.navItems).map(([key, item]) => {
                if (!item.visible) return null;
                return (
                <button
                    key={key}
                    onClick={() => handleNavClick(key)}
                    className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-colors duration-300 ${
                        activeTab === key
                        ? "bg-white text-indigo-600 shadow"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                >
                    {item.label}
                </button>
            )})}
            </div>
            <div className="flex items-center gap-3">
                <ProfileDropdown 
                    workerInfo={workerInfo}
                    onEditProfile={() => openModal('profile')}
                    onEditTemplates={() => { setActiveTab('overview'); setActiveView('templates'); }}
                />
            </div>
        </nav>
        
        <SendInvoicesModal 
                isOpen={modalState.view === 'sendInvoices'}
                onClose={closeModal}
                draftInvoices={invoices.filter(i => i.status === 'draft')}
                onSend={handleSendInvoices}
        />
        <EditOverviewModal 
            isOpen={modalState.view === 'editOverview'}
            onClose={closeModal}
            uiSettings={uiSettings}
            onSave={setUiSettings}
        />
        <AppModal 
            isOpen={modalState.isOpen && !['sendInvoices', 'editOverview'].includes(modalState.view)} 
            onClose={closeModal}
            title={
                modalState.view === 'profile' ? "Edit Worker Profile" :
                modalState.view === 'client' ? (modalState.data ? "Edit Client" : "New Client") :
                modalState.view === 'service' ? (modalState.data ? "Edit Service" : "New Service") :
                modalState.view === 'recurringExpense' ? (modalState.data ? "Edit Recurring Item" : "New Recurring Item") :
                modalState.view === 'shift' ? "Log New Shift" : 
                modalState.view === 'invoice-preview' ? "Invoice Preview" : ""
            } 
            maxWidth={
                modalState.view === 'invoice-preview' ? 'max-w-4xl' :
                ['client', 'profile'].includes(modalState.view as string) ? 'max-w-2xl' : 'max-w-md'
            }>
                {renderModalContent()}
            </AppModal>

        <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
            {renderContent()}
        </main>
        </div>
    );
    }

    // Add custom styles for form inputs and animations
    const style = document.createElement('style');
    style.textContent = `
    .form-input {
        width: 100%;
        border: 1px solid #cbd5e1; /* slate-300 */
        padding: 0.5rem 0.75rem;
        border-radius: 0.5rem; /* rounded-lg */
        transition: box-shadow 0.2s, border-color 0.2s;
        font-size: 0.875rem;
    }
    .form-input:focus, .form-input:focus-visible {
        outline: none;
        border-color: #4f46e5; /* indigo-600 */
        box-shadow: 0 0 0 2px #c7d2fe; /* indigo-200 */
    }
    .form-label {
        display: block;
        font-size: 0.75rem;
        font-weight: 500;
        color: #475569; /* slate-600 */
        margin-bottom: 0.25rem;
    }
    @keyframes fade-in-scale {
        from {
            opacity: 0;
            transform: scale(0.95);
        }
        to {
            opacity: 1;
            transform: scale(1);
        }
    }
    .animate-fade-in-scale {
        animation: fade-in-scale 0.2s ease-out forwards;
    }
    .ql-editor {
        min-height: 80px;
    }
    .ql-toolbar {
        border-top-left-radius: 0.5rem;
        border-top-right-radius: 0.5rem;
        border-color: #cbd5e1 !important;
    }
    .ql-container {
        border-bottom-left-radius: 0.5rem;
        border-bottom-right-radius: 0.5rem;
        border-color: #cbd5e1 !important;
    }
    `;
    document.head.appendChild(style);
