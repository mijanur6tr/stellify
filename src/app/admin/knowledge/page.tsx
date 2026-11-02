'use client';

import * as React from 'react';
import {
  BookOpen,
  Plus,
  Search,
  Sparkles,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertCircle,
  X,
  RotateCcw,
  ShieldCheck,
  FileText,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

interface KnowledgeDoc {
  id: string;
  title: string;
  category: 'POLICY' | 'SIZING' | 'CRAFT' | 'BRAND_STORY' | 'FAQ';
  content: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function AdminKnowledgePage() {
  const [docs, setDocs] = React.useState<KnowledgeDoc[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [activeCategory, setActiveCategory] = React.useState<string>('ALL');
  const [search, setSearch] = React.useState('');

  // Modal / Form state for Create / Edit
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingDocId, setEditingDocId] = React.useState<string | null>(null);
  const [modalForm, setModalForm] = React.useState({
    title: '',
    category: 'POLICY' as KnowledgeDoc['category'],
    content: '',
    isPublished: true,
  });
  const [isSaving, setIsSaving] = React.useState(false);

  // RAG Testing Playground state
  const [testQuery, setTestQuery] = React.useState('What is your delivery charge and payment policy?');
  const [isTestingRag, setIsTestingRag] = React.useState(false);
  const [testResults, setTestResults] = React.useState<{
    matches: any[];
    generatedReply: string;
  } | null>(null);

  const fetchDocs = React.useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/knowledge');
      const data = await res.json();
      if (res.ok && data.documents) {
        setDocs(data.documents);
      }
    } catch (err) {
      console.error('Failed to load knowledge docs:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchDocs();
  }, [fetchDocs]);

  const handleOpenCreateModal = () => {
    setEditingDocId(null);
    setModalForm({
      title: '',
      category: 'POLICY',
      content: '',
      isPublished: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (doc: KnowledgeDoc) => {
    setEditingDocId(doc.id);
    setModalForm({
      title: doc.title,
      category: doc.category,
      content: doc.content,
      isPublished: doc.isPublished,
    });
    setIsModalOpen(true);
  };

  const handleSaveDoc = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!modalForm.title.trim() || !modalForm.content.trim()) return;

    setIsSaving(true);
    try {
      if (editingDocId) {
        // PATCH
        const res = await fetch('/api/admin/knowledge', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: editingDocId,
            ...modalForm,
          }),
        });
        if (res.ok) {
          await fetchDocs();
          setIsModalOpen(false);
        }
      } else {
        // POST
        const res = await fetch('/api/admin/knowledge', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(modalForm),
        });
        if (res.ok) {
          await fetchDocs();
          setIsModalOpen(false);
        }
      }
    } catch (err) {
      console.error('Save knowledge doc failed:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleTogglePublish = async (id: string, currentStatus: boolean) => {
    setDocs((prev) =>
      prev.map((d) => (d.id === id ? { ...d, isPublished: !currentStatus } : d))
    );
    try {
      await fetch('/api/admin/knowledge', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id,
          isPublished: !currentStatus,
        }),
      });
    } catch (err) {
      console.error('Toggle publish failed:', err);
      fetchDocs();
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to remove this policy document?')) return;
    setDocs((prev) => prev.filter((d) => d.id !== id));
    try {
      await fetch(`/api/admin/knowledge?id=${id}`, {
        method: 'DELETE',
      });
    } catch (err) {
      console.error('Delete failed:', err);
      fetchDocs();
    }
  };

  const handleRunRagTest = async () => {
    if (!testQuery.trim()) return;
    setIsTestingRag(true);
    try {
      const res = await fetch('/api/admin/knowledge/test-rag', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: testQuery }),
      });
      const data = await res.json();
      if (res.ok) {
        setTestResults({
          matches: data.matches || [],
          generatedReply: data.generatedReply || '',
        });
      }
    } catch (err) {
      console.error('Test RAG failed:', err);
    } finally {
      setIsTestingRag(false);
    }
  };

  const filteredDocs = docs.filter((d) => {
    if (activeCategory !== 'ALL' && d.category !== activeCategory) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        d.title.toLowerCase().includes(q) ||
        d.content.toLowerCase().includes(q) ||
        d.category.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] uppercase font-sans tracking-[0.25em] text-[#C5A059] block mb-1">
            Atelier Governance &amp; AI RAG Engine
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#FAF7F2] font-light">
            Store Policies &amp; <span className="italic text-[#C5A059]">Knowledge Base</span>
          </h1>
          <p className="text-xs sm:text-sm font-sans text-[#D4C9BA]/70 mt-1 font-light">
            Manage company policies, sizing guidelines, craft care, and brand stories. Real-time RAG embedding synchronizes directly with the AI Style Concierge.
          </p>
        </div>

        <Button onClick={handleOpenCreateModal} size="md" className="gap-2 shrink-0">
          <Plus className="w-4 h-4" />
          <span>Add New Policy</span>
        </Button>
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#162B4C]">
        <div className="flex flex-wrap items-center gap-2">
          {['ALL', 'POLICY', 'SIZING', 'CRAFT', 'BRAND_STORY', 'FAQ'].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-sm text-xs font-sans tracking-wide transition-all ${
                activeCategory === cat
                  ? 'bg-[#C5A059] text-[#071326] font-semibold'
                  : 'bg-[#071326] text-[#FAF7F2]/70 hover:text-[#FAF7F2] border border-[#162B4C]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#FAF7F2]/40" />
          <input
            type="text"
            placeholder="Search policies..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#071326] border border-[#162B4C] rounded-sm pl-9 pr-3.5 py-1.5 text-xs text-[#FAF7F2] focus:outline-none focus:border-[#C5A059]"
          />
        </div>
      </div>

      {/* Policies Document Table */}
      <div className="bg-[#071326] border border-[#162B4C] rounded-sm overflow-hidden shadow-xl">
        <div className="p-6 border-b border-[#162B4C] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-[#C5A059]" />
            <h3 className="font-serif text-xl text-[#FAF7F2]">Active Knowledge Base ({filteredDocs.length})</h3>
          </div>
          <span className="text-xs text-emerald-400 font-sans flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            RAG Vector Indexed
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs font-sans">
            <thead>
              <tr className="border-b border-[#162B4C] bg-[#0B1C36] text-[#C5A059]">
                <th className="p-4 uppercase tracking-[0.18em]">Category</th>
                <th className="p-4 uppercase tracking-[0.18em]">Document Title</th>
                <th className="p-4 uppercase tracking-[0.18em]">Content Preview</th>
                <th className="p-4 uppercase tracking-[0.18em]">Status</th>
                <th className="p-4 uppercase tracking-[0.18em] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#162B4C]">
              {filteredDocs.map((doc) => (
                <tr key={doc.id} className="hover:bg-[#0B1C36]/50 transition-colors">
                  <td className="p-4">
                    <Badge variant={doc.category === 'POLICY' ? 'gold' : doc.category === 'SIZING' ? 'cobalt' : 'subtle'}>
                      {doc.category}
                    </Badge>
                  </td>
                  <td className="p-4 font-medium text-[#FAF7F2] max-w-[200px]">
                    {doc.title}
                    <span className="block text-[10px] text-[#FAF7F2]/40 font-normal mt-0.5">
                      Updated {new Date(doc.updatedAt).toLocaleDateString()}
                    </span>
                  </td>
                  <td className="p-4 text-[#FAF7F2]/70 max-w-[320px]">
                    <p className="line-clamp-2 text-[11px] leading-relaxed">
                      {doc.content.replace(/[#*`]/g, '')}
                    </p>
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => handleTogglePublish(doc.id, doc.isPublished)}
                      className={`text-[10px] uppercase font-sans tracking-[0.18em] px-2.5 py-1 rounded-sm border transition-all ${
                        doc.isPublished
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                          : 'bg-[#162B4C] text-[#FAF7F2]/50 border-transparent'
                      }`}
                    >
                      {doc.isPublished ? 'Published' : 'Draft'}
                    </button>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleOpenEditModal(doc)}
                        className="p-1.5 rounded-sm hover:text-[#C5A059] text-[#FAF7F2]/60 transition-colors"
                        title="Edit Policy"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(doc.id)}
                        className="p-1.5 rounded-sm hover:text-[#E08A93] text-[#FAF7F2]/40 transition-colors"
                        title="Delete Document"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Live RAG Policy Tester Playground */}
      <div className="bg-[#071326] border border-[#C5A059]/40 rounded-sm p-6 sm:p-8 space-y-6 shadow-2xl">
        <div className="flex items-center justify-between pb-4 border-b border-[#162B4C]">
          <div className="flex items-center gap-2.5 text-[#C5A059]">
            <Sparkles className="w-5 h-5" />
            <h3 className="font-serif text-2xl text-[#FAF7F2] font-normal">
              Live RAG Policy Retrieval Playground
            </h3>
          </div>
          <span className="text-[11px] font-sans text-[#FAF7F2]/50">
            Real-time verification of policies against Gemini Style Concierge
          </span>
        </div>

        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              placeholder="Ask a question as a customer (e.g. 'Can I return bangles?' or 'Delivery fee to Sylhet?')"
              value={testQuery}
              onChange={(e) => setTestQuery(e.target.value)}
              className="flex-1 bg-[#0B1C36] border border-[#162B4C] rounded-sm px-4 py-2.5 text-xs text-[#FAF7F2] focus:outline-none focus:border-[#C5A059]"
            />
            <Button
              onClick={handleRunRagTest}
              isLoading={isTestingRag}
              size="md"
              className="gap-2 shrink-0"
            >
              <Sparkles className="w-4 h-4" />
              <span>Test RAG Search</span>
            </Button>
          </div>

          {/* Test Results Output */}
          {testResults && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pt-4 border-t border-[#162B4C]">
              {/* Left Column: Retrieved Knowledge Chunks */}
              <div className="md:col-span-5 space-y-3">
                <span className="text-[10px] uppercase font-sans tracking-[0.2em] text-[#C5A059] block font-semibold">
                  1. Retrieved Policy Chunks ({testResults.matches.length})
                </span>
                {testResults.matches.length === 0 ? (
                  <p className="text-xs text-[#FAF7F2]/50 italic">No direct document matches found.</p>
                ) : (
                  testResults.matches.map((m, idx) => (
                    <div
                      key={idx}
                      className="bg-[#0B1C36] p-3.5 rounded-sm border border-[#162B4C] text-xs font-sans space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-[#E5C378]">{m.title}</span>
                        <Badge variant="subtle">{m.category}</Badge>
                      </div>
                      <p className="text-[11px] text-[#FAF7F2]/70 leading-relaxed font-mono">
                        {m.snippet}
                      </p>
                      <div className="text-[10px] text-emerald-400">Score: {m.score}</div>
                    </div>
                  ))
                )}
              </div>

              {/* Right Column: Simulated Concierge Response */}
              <div className="md:col-span-7 space-y-3">
                <span className="text-[10px] uppercase font-sans tracking-[0.2em] text-[#C5A059] block font-semibold">
                  2. Generated Concierge Answer (Compact &amp; Markdown Formatted)
                </span>
                <div className="bg-[#0B1C36] border border-[#C5A059]/30 p-4 rounded-sm text-xs font-sans text-[#FAF7F2] leading-relaxed whitespace-pre-wrap">
                  {testResults.generatedReply}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal for Create / Edit Document */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#071326] border border-[#C5A059] w-full max-w-2xl rounded-sm p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-[#162B4C]">
              <div>
                <span className="text-[10px] uppercase tracking-[0.2em] text-[#C5A059] block font-sans">
                  {editingDocId ? 'Edit Knowledge Record' : 'Create Knowledge Document'}
                </span>
                <h3 className="font-serif text-2xl text-[#FAF7F2]">
                  {editingDocId ? 'Update Policy' : 'New Policy or Guide'}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-[#FAF7F2]/60 hover:text-[#FAF7F2] p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveDoc} className="space-y-4">
              <Input
                label="Document Title *"
                placeholder="e.g. Nationwide Cash on Delivery Policy"
                value={modalForm.title}
                onChange={(e) => setModalForm({ ...modalForm, title: e.target.value })}
                required
              />

              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-sans font-medium uppercase tracking-[0.2em] text-[#D4C9BA]">
                  Category *
                </label>
                <select
                  value={modalForm.category}
                  onChange={(e) =>
                    setModalForm({
                      ...modalForm,
                      category: e.target.value as KnowledgeDoc['category'],
                    })
                  }
                  className="w-full bg-[#0B1C36] border border-[#162B4C] rounded-sm px-3.5 py-2.5 text-xs text-[#FAF7F2] focus:outline-none focus:border-[#C5A059]"
                >
                  <option value="POLICY">POLICY (Payment, Shipping, Returns)</option>
                  <option value="SIZING">SIZING (Bangle Diameter &amp; Fit Guide)</option>
                  <option value="CRAFT">CRAFT (Care, Cleaning, Storage)</option>
                  <option value="BRAND_STORY">BRAND_STORY (Philosophy, Atelier Info)</option>
                  <option value="FAQ">FAQ (General Questions)</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-sans font-medium uppercase tracking-[0.2em] text-[#D4C9BA]">
                  Policy Content (Markdown supported) *
                </label>
                <textarea
                  rows={8}
                  placeholder="Detail the exact store terms, charges, instructions..."
                  value={modalForm.content}
                  onChange={(e) => setModalForm({ ...modalForm, content: e.target.value })}
                  className="w-full bg-[#0B1C36] border border-[#162B4C] rounded-sm p-3.5 text-xs text-[#FAF7F2] font-mono leading-relaxed focus:outline-none focus:border-[#C5A059]"
                  required
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="pub-check"
                  checked={modalForm.isPublished}
                  onChange={(e) => setModalForm({ ...modalForm, isPublished: e.target.checked })}
                  className="rounded border-[#162B4C] text-[#C5A059] focus:ring-0"
                />
                <label htmlFor="pub-check" className="text-xs text-[#FAF7F2]/80 font-sans cursor-pointer">
                  Publish immediately (available in AI concierge RAG retrieval)
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#162B4C]">
                <Button
                  type="button"
                  variant="outline"
                  size="md"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" size="md" isLoading={isSaving} className="gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{editingDocId ? 'Save Changes' : 'Create & Index'}</span>
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
