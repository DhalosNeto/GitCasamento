import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Family, Guest, GiftItem } from '../types';
import { familyService } from '../services/familyService';
import { giftService } from '../services/giftService';
import { Button } from './Button';
import { Plus, Trash2, Edit2, Link as LinkIcon, Users, Check, X, Gift, ChevronDown, ChevronUp, Image as ImageIcon, LogOut } from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [families, setFamilies] = useState<Family[]>([]);
  const [gifts, setGifts] = useState<GiftItem[]>([]);
  const [activeTab, setActiveTab] = useState<'families' | 'gifts'>('families');
  
  // Modals
  const [isFamilyModalOpen, setIsFamilyModalOpen] = useState(false);
  const [isGiftModalOpen, setIsGiftModalOpen] = useState(false);
  
  const [editingFamily, setEditingFamily] = useState<Family | null>(null);
  const [editingGift, setEditingGift] = useState<GiftItem | null>(null);
  const [expandedFamilyId, setExpandedFamilyId] = useState<string | null>(null);
  
  const [familyFormData, setFamilyFormData] = useState<Partial<Family>>({
    name: '',
    accessCode: '',
    members: []
  });

  const [giftFormData, setGiftFormData] = useState<Partial<GiftItem>>({
    name: '',
    price: 0,
    category: 'Cozinha',
    description: '',
    imageUrl: ''
  });

  const [priceInput, setPriceInput] = useState('');

  useEffect(() => {
    loadFamilies();
    loadGifts();
  }, []);

  const formatPrice = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, ''); // Somente números
    if (val === '') val = '0';
    const numericValue = parseInt(val) / 100;
    setGiftFormData({ ...giftFormData, price: numericValue });
    setPriceInput(formatPrice(numericValue));
  };

  useEffect(() => {
    if (giftFormData.price !== undefined) {
        setPriceInput(formatPrice(giftFormData.price));
    }
  }, [giftFormData.price]);

  const loadFamilies = async () => {
    try {
      const data = await familyService.getAll();
      setFamilies(data);
    } catch (err: any) {
      if (err.message === 'Unauthorized') {
        navigate('/admin');
      }
      console.error(err);
    }
  };

  const loadGifts = async () => {
    try {
      const data = await giftService.getAll();
      setGifts(data);
    } catch (err: any) {
      if (err.message === 'Unauthorized') {
        navigate('/admin');
      }
      console.error(err);
    }
  };

  const handleLogout = () => {
    familyService.logout();
    localStorage.removeItem('isAdminAuthenticated');
    navigate('/admin');
  };

  // --- Family Handlers ---
  const handleOpenFamilyModal = (family?: Family) => {
    if (family) {
      setEditingFamily(family);
      setFamilyFormData({
        name: family.name,
        accessCode: family.accessCode,
        members: family.members
      });
    } else {
      setEditingFamily(null);
      setFamilyFormData({
        name: '',
        accessCode: familyService.generateAccessCode(),
        members: [{ id: crypto.randomUUID(), name: '', isAttending: null }]
      });
    }
    setIsFamilyModalOpen(true);
  };

  const handleSaveFamily = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!familyFormData.name || !familyFormData.accessCode) return;

    try {
      if (editingFamily) {
        await familyService.update(editingFamily.id, familyFormData);
      } else {
        await familyService.create(familyFormData as Omit<Family, 'id'>);
      }
      loadFamilies();
      setIsFamilyModalOpen(false);
    } catch (err: any) {
      if (err.message === 'Unauthorized') navigate('/admin');
      else alert('Erro ao salvar família');
    }
  };

  const handleDeleteFamily = async (id: string) => {
    if (confirm('Excluir esta família?')) {
      try {
        await familyService.delete(id);
        loadFamilies();
      } catch (err: any) {
        if (err.message === 'Unauthorized') navigate('/admin');
      }
    }
  };

  // --- Gift Handlers ---
  const handleOpenGiftModal = (gift?: GiftItem) => {
    if (gift) {
      setEditingGift(gift);
      setGiftFormData({
        name: gift.name,
        price: gift.price,
        category: gift.category,
        description: gift.description || '',
        imageUrl: gift.imageUrl || ''
      });
      setPriceInput(formatPrice(gift.price));
    } else {
      setEditingGift(null);
      setGiftFormData({
        name: '',
        price: 0,
        category: 'Cozinha',
        description: '',
        imageUrl: ''
      });
      setPriceInput(formatPrice(0));
    }
    setIsGiftModalOpen(true);
  };

  const handleSaveGift = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!giftFormData.name) {
        alert('O nome do presente é obrigatório.');
        return;
    }

    try {
      if (editingGift) {
        await giftService.update(editingGift.id, giftFormData);
      } else {
        await giftService.create(giftFormData as Omit<GiftItem, 'id'>);
      }
      loadGifts();
      setIsGiftModalOpen(false);
      setGiftFormData({ name: '', price: 0, category: 'Cozinha', description: '', imageUrl: '' });
      setPriceInput(formatPrice(0));
    } catch (err: any) {
      if (err.message === 'Unauthorized') navigate('/admin');
      else alert('Erro ao salvar presente');
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch(`${familyService.getApiUrl()}/admin/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('wedding_admin_token')}`
        },
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        if (response.status === 401) {
            handleLogout();
            throw new Error('Sua sessão expirou. Por favor, faça login novamente.');
        }
        throw new Error(errorData.error || 'Falha no upload');
      }

      const data = await response.json();
      setGiftFormData({ ...giftFormData, imageUrl: data.imageUrl });
    } catch (err: any) {
      console.error('Erro detalhado no upload:', err);
      alert(`Erro ao fazer upload da imagem: ${err.message}`);
    }
  };

  const handleDeleteGift = async (id: string) => {
    if (confirm('Excluir este presente?')) {
      try {
        await giftService.delete(id);
        loadGifts();
      } catch (err: any) {
        if (err.message === 'Unauthorized') navigate('/admin');
      }
    }
  };

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Dynamic Header with Logout */}
      <header className="bg-white border-b border-stone-200 py-6 px-4 md:px-8">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
            <div>
                <h1 className="text-3xl font-serif text-wedding-primary">Painel de Controle</h1>
                <p className="text-sm text-stone-400 font-light">Gerencie os detalhes do seu grande dia.</p>
            </div>
            <button 
                onClick={handleLogout}
                className="flex items-center gap-2 text-stone-400 hover:text-red-500 transition-all font-medium text-xs uppercase tracking-widest bg-stone-50 px-4 py-2 rounded-sm border border-stone-100"
            >
                <LogOut size={16} /> Sair
            </button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto p-4 md:p-8">
        {/* Tab Switcher */}
        <div className="flex gap-4 mb-8 border-b border-stone-200">
           <button 
             onClick={() => setActiveTab('families')}
             className={`pb-4 px-2 text-sm font-medium transition-all relative ${activeTab === 'families' ? 'text-wedding-primary' : 'text-stone-400 hover:text-stone-600'}`}
           >
             <div className="flex items-center gap-2">
                <Users size={18} /> Convidados
             </div>
             {activeTab === 'families' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-wedding-primary"></div>}
           </button>
           <button 
             onClick={() => setActiveTab('gifts')}
             className={`pb-4 px-2 text-sm font-medium transition-all relative ${activeTab === 'gifts' ? 'text-wedding-primary' : 'text-stone-400 hover:text-stone-600'}`}
           >
             <div className="flex items-center gap-2">
                <Gift size={18} /> Lista de Presentes
             </div>
             {activeTab === 'gifts' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-wedding-primary"></div>}
           </button>
        </div>

        {activeTab === 'families' ? (
          <div className="animate-fadeIn">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-serif text-stone-700">Famílias e Convidados ({families.length})</h2>
              <Button onClick={() => handleOpenFamilyModal()} className="flex items-center gap-2">
                <Plus size={18} /> Nova Família
              </Button>
            </div>

            <div className="bg-white rounded-sm shadow-sm border border-stone-200 overflow-hidden">
              <table className="min-w-full divide-y divide-stone-200">
                <thead className="bg-stone-50">
                  <tr className="text-[10px] uppercase tracking-widest text-stone-500 font-bold">
                    <th className="px-6 py-4 text-left">Família</th>
                    <th className="px-6 py-4 text-left">Código</th>
                    <th className="px-6 py-4 text-left">Membros</th>
                    <th className="px-6 py-4 text-left">Status</th>
                    <th className="px-6 py-4 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-stone-100">
                  {families.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center italic text-stone-400">Nenhuma família cadastrada.</td>
                    </tr>
                  ) : (
                    families.map((family) => {
                      const confirmedCount = family.members.filter(m => m.isAttending === true).length;
                      const totalMembers = family.members.length;
                      const hasResponded = family.members.some(m => m.isAttending !== null);
                      const isExpanded = expandedFamilyId === family.id;

                      return (
                        <React.Fragment key={family.id}>
                          <tr className={`hover:bg-stone-50/50 transition-colors ${isExpanded ? 'bg-stone-50/50' : ''}`}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <button
                                  onClick={() => setExpandedFamilyId(isExpanded ? null : family.id)}
                                  className="flex items-center gap-3 text-stone-800 font-medium hover:text-wedding-primary transition-colors"
                              >
                                  {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                  {family.name}
                              </button>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap font-mono text-xs text-stone-500">{family.accessCode}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-stone-400 text-sm">{totalMembers}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-xs">
                               <span className={`px-2 py-1 rounded-full font-bold uppercase tracking-tight ${hasResponded ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'}`}>
                                  {hasResponded ? `${confirmedCount}/${totalMembers} Sim` : 'Pendente'}
                               </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right space-x-3">
                              <button onClick={() => {
                                  const link = `${window.location.origin}/convite/${family.id}`;
                                  navigator.clipboard.writeText(link);
                                  alert('Link copiado!');
                              }} className="text-stone-400 hover:text-blue-500 transition-colors" title="Copiar Link"><LinkIcon size={18} /></button>
                              <button onClick={() => handleOpenFamilyModal(family)} className="text-stone-400 hover:text-indigo-500 transition-colors" title="Editar"><Edit2 size={18} /></button>
                              <button onClick={() => handleDeleteFamily(family.id)} className="text-stone-400 hover:text-red-500 transition-colors" title="Excluir"><Trash2 size={18} /></button>
                            </td>
                          </tr>
                          {isExpanded && (
                            <tr className="bg-stone-50/30">
                              <td colSpan={5} className="px-12 py-4">
                                  <div className="space-y-2">
                                      {family.members.map(m => (
                                          <div key={m.id} className="flex justify-between items-center text-xs text-stone-500 border-b border-stone-100 pb-2">
                                              <span>{m.name}</span>
                                              <span>{m.isAttending === true ? '✅ Confirmado' : m.isAttending === false ? '❌ Ausente' : '⏳ Pendente'}</span>
                                          </div>
                                      ))}
                                  </div>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="animate-fadeIn">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-serif text-stone-700">Lista Dinâmica ({gifts.length})</h2>
              <Button onClick={() => handleOpenGiftModal()} className="flex items-center gap-2">
                <Plus size={18} /> Novo Presente
              </Button>
            </div>

            {gifts.length === 0 ? (
              <div className="py-20 text-center bg-white border border-stone-200 rounded-sm italic text-stone-400">Nenhum presente na lista ainda.</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {gifts.map((gift) => (
                  <div key={gift.id} className="bg-white p-6 rounded-sm border border-stone-200 shadow-sm flex flex-col justify-between group h-full">
                    <div>
                      <div className="flex justify-between items-start mb-4">
                          <div className="w-12 h-12 bg-stone-50 rounded-lg overflow-hidden flex items-center justify-center text-stone-300 group-hover:text-wedding-primary transition-colors border border-stone-100">
                              {gift.imageUrl ? <img src={`${familyService.getBaseUrl()}${gift.imageUrl}`} className="w-full h-full object-cover" /> : <Gift size={24} />}
                          </div>
                          <div className="flex gap-2">
                              <button onClick={() => handleOpenGiftModal(gift)} className="text-stone-300 hover:text-indigo-500 transition-colors">
                                  <Edit2 size={16} />
                              </button>
                              <button onClick={() => handleDeleteGift(gift.id)} className="text-stone-300 hover:text-red-500 transition-colors">
                                  <Trash2 size={16} />
                              </button>
                          </div>
                      </div>
                      <h3 className="font-serif text-lg text-stone-800 mb-1">{gift.name}</h3>
                      <p className="text-xs text-stone-400 mb-2">{gift.category}</p>
                      <p className="text-xs text-stone-500 line-clamp-2 italic font-light">{gift.description || 'Sem descrição'}</p>
                    </div>
                    <div className="mt-4 pt-4 border-t border-stone-50 flex justify-between items-center">
                      <span className="text-xs text-stone-400 uppercase tracking-widest font-bold">Valor</span>
                      <span className="font-serif text-xl text-wedding-primary">
                          {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(gift.price)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Family Modal */}
      {isFamilyModalOpen && (
        <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-sm shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto animate-scaleIn">
            <div className="p-6 border-b border-stone-100 flex justify-between items-center">
              <h3 className="text-2xl font-serif text-stone-800">
                {editingFamily ? 'Editar Família' : 'Nova Família'}
              </h3>
              <button onClick={() => setIsFamilyModalOpen(false)} className="text-stone-400 hover:text-stone-600"><X size={24} /></button>
            </div>
            <form onSubmit={handleSaveFamily} className="p-8 space-y-6">
                <div>
                    <label className="text-[10px] uppercase tracking-widest text-stone-400 font-bold mb-2 block">Nome da Família</label>
                    <input type="text" required value={familyFormData.name} onChange={(e) => setFamilyFormData({ ...familyFormData, name: e.target.value })} 
                    className="w-full p-3 border border-stone-200 rounded-sm focus:border-wedding-primary outline-none" />
                </div>
                <div>
                    <label className="text-[10px] uppercase tracking-widest text-stone-400 font-bold mb-2 block">Código de Acesso</label>
                    <input type="text" required value={familyFormData.accessCode} onChange={(e) => setFamilyFormData({ ...familyFormData, accessCode: e.target.value.toUpperCase() })} 
                    className="w-full p-3 border border-stone-200 rounded-sm focus:border-wedding-primary outline-none font-mono" />
                </div>
                <div>
                   <div className="flex justify-between items-center mb-4">
                      <label className="text-[10px] uppercase tracking-widest text-stone-400 font-bold">Membros</label>
                      <button type="button" onClick={() => setFamilyFormData({...familyFormData, members: [...(familyFormData.members || []), { id: crypto.randomUUID(), name: '', isAttending: null }]})} 
                      className="text-xs text-wedding-primary font-bold hover:underline">+ Adicionar</button>
                   </div>
                   <div className="space-y-3 max-h-48 overflow-y-auto pr-2">
                      {familyFormData.members?.map((m, i) => (
                        <div key={m.id} className="flex gap-2">
                           <input type="text" required value={m.name} onChange={(e) => {
                             const nm = [...(familyFormData.members || [])];
                             nm[i].name = e.target.value;
                             setFamilyFormData({...familyFormData, members: nm});
                           }} className="flex-1 p-2 border border-stone-100 text-sm outline-none focus:border-wedding-primary" />
                           <button type="button" onClick={() => {
                             const nm = [...(familyFormData.members || [])];
                             nm.splice(i, 1);
                             setFamilyFormData({...familyFormData, members: nm});
                           }} disabled={familyFormData.members?.length === 1} className="text-stone-300 hover:text-red-500"><Trash2 size={16}/></button>
                        </div>
                      ))}
                   </div>
                </div>
                <div className="pt-6 flex gap-4">
                   <Button variant="secondary" className="flex-1" onClick={() => setIsFamilyModalOpen(false)}>Cancelar</Button>
                   <Button type="submit" className="flex-1">Salvar</Button>
                </div>
            </form>
          </div>
        </div>
      )}

      {/* Gift Modal */}
      {isGiftModalOpen && (
        <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
           <div className="bg-white rounded-sm shadow-xl max-w-md w-full animate-scaleIn max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-stone-100 flex justify-between items-center">
                 <h3 className="text-2xl font-serif text-stone-800">
                    {editingGift ? 'Editar Presente' : 'Novo Presente'}
                 </h3>
                 <button onClick={() => setIsGiftModalOpen(false)} className="text-stone-400 hover:text-stone-600"><X size={24} /></button>
              </div>
              <form onSubmit={handleSaveGift} className="p-8 space-y-6">
                 <div>
                    <label className="text-[10px] uppercase tracking-widest text-stone-400 font-bold mb-2 block">Foto do Presente</label>
                    <div className="flex items-center gap-4 border border-stone-100 p-4 rounded-sm bg-stone-50/50">
                        <div className="w-20 h-20 bg-white rounded-sm border border-stone-200 flex items-center justify-center overflow-hidden flex-shrink-0">
                            {giftFormData.imageUrl ? (
                                <img src={`${familyService.getBaseUrl()}${giftFormData.imageUrl}`} alt="Preview" className="w-full h-full object-cover" />
                            ) : (
                                <ImageIcon size={32} className="text-stone-200" />
                            )}
                        </div>
                        <div className="flex-1">
                            <input 
                                type="file" 
                                id="gift-image"
                                className="hidden" 
                                accept="image/*" 
                                onChange={handleImageUpload} 
                            />
                            <label 
                                htmlFor="gift-image"
                                className="cursor-pointer bg-white border border-stone-200 text-stone-600 px-4 py-2 rounded-sm text-xs font-bold hover:border-wedding-primary transition-colors flex items-center gap-2 justify-center"
                            >
                                <Plus size={14} /> Selecionar Foto
                            </label>
                            <p className="text-[9px] text-stone-400 mt-2 uppercase tracking-tight">JPG, PNG ou WebP (Máx 5MB)</p>
                        </div>
                    </div>
                 </div>
                 <div>
                    <label className="text-[10px] uppercase tracking-widest text-stone-400 font-bold mb-2 block">Nome do Presente</label>
                    <input type="text" required value={giftFormData.name} onChange={(e) => setGiftFormData({ ...giftFormData, name: e.target.value })} 
                    className="w-full p-3 border border-stone-200 rounded-sm focus:border-wedding-primary outline-none" />
                 </div>
                 <div>
                    <label className="text-[10px] uppercase tracking-widest text-stone-400 font-bold mb-2 block">Valor (R$)</label>
                    <input type="text" required value={priceInput} onChange={handlePriceChange} 
                    className="w-full p-3 border border-stone-200 rounded-sm focus:border-wedding-primary outline-none" />
                 </div>
                 <div>
                    <label className="text-[10px] uppercase tracking-widest text-stone-400 font-bold mb-2 block">Categoria</label>
                    <select value={giftFormData.category} onChange={(e) => setGiftFormData({ ...giftFormData, category: e.target.value })} 
                    className="w-full p-3 border border-stone-200 rounded-sm focus:border-wedding-primary outline-none bg-white">
                        <option>Cozinha</option>
                        <option>Eletros</option>
                        <option>Decoração</option>
                        <option>Viagem</option>
                        <option>Outros</option>
                    </select>
                 </div>
                 <div>
                    <label className="text-[10px] uppercase tracking-widest text-stone-400 font-bold mb-2 block">Descrição</label>
                    <textarea value={giftFormData.description} onChange={(e) => setGiftFormData({ ...giftFormData, description: e.target.value })} 
                    className="w-full p-3 border border-stone-200 rounded-sm focus:border-wedding-primary outline-none bg-white min-h-[100px]"
                    placeholder="Ex: Jogo de panelas Tramontina antiaderente"
                    ></textarea>
                 </div>
                 <div className="pt-4 flex gap-4">
                   <Button variant="secondary" className="flex-1" onClick={() => setIsGiftModalOpen(false)}>Cancelar</Button>
                   <Button type="submit" className="flex-1">Salvar Presente</Button>
                </div>
              </form>
           </div>
        </div>
      )}
    </div>
  );
};
