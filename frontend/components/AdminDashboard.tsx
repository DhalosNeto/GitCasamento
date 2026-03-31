import React, { useState, useEffect } from 'react';
import { Family, Guest } from '../types';
import { familyService } from '../services/familyService';
import { Button } from './Button';
import { Plus, Trash2, Edit2, Link as LinkIcon, Users, Check, X, Gift, ChevronDown, ChevronUp, Utensils } from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const [families, setFamilies] = useState<Family[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFamily, setEditingFamily] = useState<Family | null>(null);
  const [expandedFamilyId, setExpandedFamilyId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Family>>({
    name: '',
    accessCode: '',
    members: []
  });

  useEffect(() => {
    loadFamilies();
  }, []);

  const loadFamilies = async () => {
    try {
      const data = await familyService.getAll();
      setFamilies(data);
    } catch (err) {
      console.error(err);
      alert('Erro ao carregar famílias');
    }
  };

  const handleOpenModal = (family?: Family) => {
    if (family) {
      setEditingFamily(family);
      setFormData({
        name: family.name,
        accessCode: family.accessCode,
        members: family.members
      });
    } else {
      setEditingFamily(null);
      setFormData({
        name: '',
        accessCode: familyService.generateAccessCode(),
        members: [{ id: crypto.randomUUID(), name: '', isAttending: null }]
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingFamily(null);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.accessCode) return;

    const familyData = {
      name: formData.name,
      accessCode: formData.accessCode,
      members: formData.members || []
    };

    try {
      if (editingFamily) {
        await familyService.update(editingFamily.id, familyData);
      } else {
        await familyService.create(familyData as Omit<Family, 'id'>);
      }
      loadFamilies();
      handleCloseModal();
    } catch (err) {
      console.error(err);
      alert('Erro ao salvar família');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta família?')) {
      try {
        await familyService.delete(id);
        loadFamilies();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleAddMember = () => {
    setFormData({
      ...formData,
      members: [...(formData.members || []), { id: crypto.randomUUID(), name: '', isAttending: null }]
    });
  };

  const handleRemoveMember = (index: number) => {
    const newMembers = [...(formData.members || [])];
    newMembers.splice(index, 1);
    setFormData({ ...formData, members: newMembers });
  };

  const handleMemberChange = (index: number, value: string) => {
    const newMembers = [...(formData.members || [])];
    newMembers[index] = { ...newMembers[index], name: value };
    setFormData({ ...formData, members: newMembers });
  };

  const copyLink = (id: string) => {
    const link = `${window.location.origin}/confirmacao/${id}`;
    navigator.clipboard.writeText(link);
    alert('Link copiado para a área de transferência!');
  };

  return (
    <div className="min-h-screen bg-stone-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-serif text-wedding-primary">Gestão de Convidados</h1>
          <div className="flex gap-3">
            <Button variant="secondary" onClick={loadFamilies} className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /><path d="M3 3v5h5" /></svg>
              Atualizar
            </Button>
            <button
              onClick={() => window.location.href = '/presentes'}
              className="flex items-center gap-2 px-4 py-2 border border-wedding-secondary text-wedding-secondary hover:bg-wedding-secondary hover:text-white rounded-sm transition-all"
            >
              <Gift size={20} />
              Ver Presentes
            </button>
            <Button onClick={() => handleOpenModal()} className="flex items-center gap-2">
              <Plus size={20} />
              Nova Família
            </Button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-stone-200">
            <thead className="bg-stone-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">Família</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">Código</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">Membros</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-stone-500 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-stone-200">
              {families.map((family) => {
                const confirmedCount = family.members.filter(m => m.isAttending === true).length;
                const totalMembers = family.members.length;
                const hasResponded = family.members.some(m => m.isAttending !== null);
                const isExpanded = expandedFamilyId === family.id;

                return (
                  <React.Fragment key={family.id}>
                    <tr className={`hover:bg-stone-50 transition-colors ${isExpanded ? 'bg-stone-50' : ''}`}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setExpandedFamilyId(isExpanded ? null : family.id)}
                            className="text-stone-400 hover:text-stone-600 focus:outline-none"
                          >
                            {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                          </button>
                          <div className="text-sm font-medium text-stone-900">{family.name}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-stone-500 font-mono">{family.accessCode}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-stone-500 flex items-center gap-1">
                          <Users size={16} />
                          {totalMembers}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${hasResponded
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                          }`}>
                          {hasResponded ? `${confirmedCount}/${totalMembers} Confirmados` : 'Pendente'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                        <button onClick={() => copyLink(family.id)} className="text-blue-600 hover:text-blue-900" title="Copiar Link">
                          <LinkIcon size={18} />
                        </button>
                        <button onClick={() => handleOpenModal(family)} className="text-indigo-600 hover:text-indigo-900" title="Editar">
                          <Edit2 size={18} />
                        </button>
                        <button onClick={() => handleDelete(family.id)} className="text-red-600 hover:text-red-900" title="Excluir">
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                    {isExpanded && (
                      <tr>
                        <td colSpan={5} className="px-6 py-4 bg-stone-50/50 border-b border-stone-200">
                          <div className="pl-8">
                            <h4 className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-3">Detalhes dos Convidados</h4>
                            <div className="grid gap-3">
                              {family.members.map(member => (
                                <div key={member.id} className="flex items-center justify-between text-sm bg-white p-3 rounded shadow-sm border border-stone-100">
                                  <div className="font-medium text-stone-800">{member.name}</div>
                                  <div className="flex items-center gap-4 text-stone-500">
                                    {member.dietaryRestrictions && (
                                      <div className="flex items-center gap-1 text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded" title="Restrição Alimentar">
                                        <Utensils size={12} />
                                        {member.dietaryRestrictions}
                                      </div>
                                    )}
                                    <div className="w-24 text-right flex justify-end">
                                      {member.isAttending === true && (
                                        <span className="flex items-center gap-1 text-green-600 font-medium"><Check size={14} /> Confirmado</span>
                                      )}
                                      {member.isAttending === false && (
                                        <span className="flex items-center gap-1 text-red-500"><X size={14} /> Ausente</span>
                                      )}
                                      {member.isAttending === null && (
                                        <span className="text-stone-400 italic">Pendente</span>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-stone-200 flex justify-between items-center">
              <h3 className="text-xl font-serif text-stone-800">
                {editingFamily ? 'Editar Família' : 'Nova Família'}
              </h3>
              <button onClick={handleCloseModal} className="text-stone-400 hover:text-stone-600">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Nome da Família</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-stone-300 rounded focus:ring-wedding-primary focus:border-wedding-primary"
                  placeholder="Ex: Família Silva"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Código de Acesso (Opcional)</label>
                <input
                  type="text"
                  value={formData.accessCode}
                  onChange={(e) => setFormData({ ...formData, accessCode: e.target.value.toUpperCase() })}
                  className="w-full px-3 py-2 border border-stone-300 rounded focus:ring-wedding-primary focus:border-wedding-primary uppercase"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-stone-700">Membros</label>
                  <button
                    type="button"
                    onClick={handleAddMember}
                    className="text-sm text-wedding-primary hover:underline flex items-center gap-1"
                  >
                    <Plus size={14} /> Adicionar
                  </button>
                </div>

                <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                  {formData.members?.map((member, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        required
                        value={member.name}
                        onChange={(e) => handleMemberChange(index, e.target.value)}
                        className="flex-1 px-3 py-2 border border-stone-300 rounded focus:ring-wedding-primary focus:border-wedding-primary text-sm"
                        placeholder="Nome do convidado"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveMember(index)}
                        className="text-red-400 hover:text-red-600 p-2"
                        disabled={(formData.members?.length || 0) <= 1}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <Button variant="secondary" onClick={handleCloseModal} type="button">
                  Cancelar
                </Button>
                <Button type="submit">
                  Salvar
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
