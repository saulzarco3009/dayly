'use client';

import React, { useState, useMemo } from 'react';
import {
  FileText,
  Plus,
  Search,
  Pin,
  Trash2,
  Edit2,
  Calendar,
  X,
  Tag,
} from 'lucide-react';
import { useDayly } from '@/context/DaylyContext';
import { formatFriendlyDate } from '@/utils/dateUtils';
import { Note } from '@/types/dayly';

export function NotesView() {
  const { notes, addNote, updateNote, deleteNote, openQuickAdd } = useDayly();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeEditingNote, setActiveEditingNote] = useState<Note | null>(null);

  // Extract distinct categories
  const categories = useMemo(() => {
    const set = new Set<string>();
    notes.forEach((n) => {
      if (n.category) set.add(n.category);
    });
    return ['All', ...Array.from(set)];
  }, [notes]);

  // Filter notes
  const filteredNotes = useMemo(() => {
    return notes
      .filter((n) => {
        if (selectedCategory !== 'All' && n.category.toLowerCase() !== selectedCategory.toLowerCase()) {
          return false;
        }
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = n.title.toLowerCase().includes(q);
          const matchContent = n.content.toLowerCase().includes(q);
          if (!matchTitle && !matchContent) return false;
        }
        return true;
      })
      .sort((a, b) => {
        // Pinned notes first
        if (a.isPinned && !b.isPinned) return -1;
        if (!a.isPinned && b.isPinned) return 1;
        return b.updatedAt.localeCompare(a.updatedAt);
      });
  }, [notes, searchQuery, selectedCategory]);

  const togglePin = (note: Note) => {
    updateNote(note.id, { isPinned: !note.isPinned });
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in pb-16">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-[#F0EBEF] shadow-2xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-[#FCFAFB] border border-[#F0EBEF] text-[#D68EAD] flex items-center justify-center">
              <FileText size={18} />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight text-[#29252B]">
                Notes & Reflections
              </h2>
              <p className="text-xs text-[#928A91]">
                Distraction-free thoughts, reading notes, and creative ideas.
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={() => openQuickAdd('note')}
          className="flex items-center space-x-2 bg-[#FBEFF4] hover:bg-[#F7EAF0] text-[#29252B] border border-[#E5A6C0] px-4 py-2 rounded-xl text-xs font-semibold self-start sm:self-auto transition-all"
        >
          <Plus size={15} className="text-[#D68EAD]" />
          <span>New Note</span>
        </button>
      </div>

      {/* Search and Category Filter */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search
            size={15}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#928A91]"
          />
          <input
            type="text"
            placeholder="Search notes or concepts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-[#F0EBEF] bg-white focus:outline-none focus:border-[#E5A6C0]"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#928A91]"
            >
              <X size={13} />
            </button>
          )}
        </div>

        {/* Categories */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 sm:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-[#FBEFF4] text-[#29252B] font-semibold border border-[#E5A6C0]'
                  : 'bg-white text-[#928A91] hover:text-[#29252B] border border-[#F0EBEF]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Notes Grid */}
      {filteredNotes.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-[#F0EBEF] p-12 text-center">
          <FileText size={32} className="mx-auto text-[#928A91] mb-2" />
          <h3 className="text-sm font-semibold text-[#29252B]">No notes found</h3>
          <p className="text-xs text-[#928A91] mt-1 mb-4">
            Capture an idea, book excerpt, or study reflection.
          </p>
          <button
            onClick={() => openQuickAdd('note')}
            className="text-xs font-semibold px-4 py-2 bg-[#FBEFF4] text-[#D68EAD] rounded-xl border border-[#E5A6C0]"
          >
            Create Note
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 items-start">
          {filteredNotes.map((note) => (
            <div
              key={note.id}
              onClick={() => setActiveEditingNote(note)}
              className={`group bg-white rounded-2xl border p-5 transition-all cursor-pointer shadow-2xs hover:shadow-xs flex flex-col justify-between min-h-[170px] ${
                note.isPinned
                  ? 'border-[#E5A6C0] bg-white ring-1 ring-[#E5A6C0]/20'
                  : 'border-[#F0EBEF] hover:border-[#E5A6C0]/50'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center space-x-1.5">
                    {note.isPinned && (
                      <Pin size={13} className="text-[#D68EAD] fill-[#D68EAD]" />
                    )}
                    <span className="text-[10px] font-semibold text-[#928A91] bg-[#FCFAFB] px-2 py-0.5 rounded-full border border-[#F0EBEF]">
                      {note.category}
                    </span>
                  </div>

                  <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        togglePin(note);
                      }}
                      className="p-1 text-[#928A91] hover:text-[#D68EAD]"
                      title={note.isPinned ? 'Unpin' : 'Pin to top'}
                    >
                      <Pin size={13} className={note.isPinned ? 'fill-[#D68EAD]' : ''} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteNote(note.id);
                      }}
                      className="p-1 text-[#928A91] hover:text-[#DF7682]"
                      title="Delete note"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>

                <h3 className="text-sm font-bold text-[#29252B] mb-1.5 line-clamp-1">
                  {note.title}
                </h3>

                <p className="text-xs text-[#928A91] whitespace-pre-line line-clamp-4 leading-relaxed font-normal">
                  {note.content}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-[#F0EBEF] flex items-center justify-between text-[10px] text-[#928A91]">
                <span>Updated {formatFriendlyDate(note.updatedAt.slice(0, 10))}</span>
                <span className="text-[#D68EAD] font-medium group-hover:underline">
                  Open Note &rarr;
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* NOTE EDITOR MODAL */}
      {activeEditingNote && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/30 backdrop-blur-xs transition-opacity"
            onClick={() => setActiveEditingNote(null)}
          />
          <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-[#F0EBEF] z-10 p-6 space-y-4 animate-fade-in max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-[#F0EBEF]">
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={activeEditingNote.category}
                  onChange={(e) =>
                    setActiveEditingNote({
                      ...activeEditingNote,
                      category: e.target.value,
                    })
                  }
                  className="text-xs font-semibold uppercase tracking-wider text-[#D68EAD] bg-[#FBEFF4] px-2.5 py-1 rounded-lg border border-[#F0EBEF] focus:outline-none"
                />
              </div>

              <button
                onClick={() => setActiveEditingNote(null)}
                className="w-8 h-8 rounded-full bg-[#FCFAFB] border border-[#F0EBEF] flex items-center justify-center text-[#928A91] hover:text-[#29252B]"
              >
                <X size={15} />
              </button>
            </div>

            <input
              type="text"
              placeholder="Note title..."
              value={activeEditingNote.title}
              onChange={(e) =>
                setActiveEditingNote({
                  ...activeEditingNote,
                  title: e.target.value,
                })
              }
              className="text-lg font-bold text-[#29252B] focus:outline-none placeholder:text-[#928A91]"
            />

            <textarea
              rows={12}
              placeholder="Write anything..."
              value={activeEditingNote.content}
              onChange={(e) =>
                setActiveEditingNote({
                  ...activeEditingNote,
                  content: e.target.value,
                })
              }
              className="w-full flex-1 p-3 text-xs rounded-xl border border-[#F0EBEF] bg-[#FCFAFB] focus:bg-white focus:outline-none focus:border-[#E5A6C0] leading-relaxed resize-none"
            />

            <div className="flex items-center justify-between pt-3 border-t border-[#F0EBEF]">
              <span className="text-[11px] text-[#928A91]">
                Created {formatFriendlyDate(activeEditingNote.createdAt.slice(0, 10))}
              </span>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setActiveEditingNote(null)}
                  className="px-3 py-1.5 text-xs text-[#928A91]"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    updateNote(activeEditingNote.id, activeEditingNote);
                    setActiveEditingNote(null);
                  }}
                  className="px-4 py-2 text-xs font-semibold bg-[#FBEFF4] border border-[#E5A6C0] text-[#29252B] rounded-xl hover:bg-[#F7EAF0]"
                >
                  Save Note
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
