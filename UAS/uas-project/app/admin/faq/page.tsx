"use client";

import React, { useEffect, useState } from "react";

interface Faq {
  id: number;
  question: string;
  answer: string;
  sort_order: number;
}

export default function AdminFaqPage() {
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const fetchFaqs = async () => {
  try {
    const res = await fetch("http://localhost:3001/api/faqs");
    const data = await res.json();
    if (Array.isArray(data)) {
      setFaqs(data);
    } else {
      setFaqs([]);
    }
  } catch (err) {
    console.error("Gagal memuat FAQ:", err);
    setFaqs([]);
  }
};

  useEffect(() => {
    fetchFaqs();
  }, []);

  const handleAddFaq = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("http://localhost:3001/api/faqs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": "1",
        },
        body: JSON.stringify({ question, answer }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Gagal menambah FAQ");
      }

      setMessage("FAQ berhasil ditambahkan!");
      setQuestion("");
      setAnswer("");
      fetchFaqs();
    } catch (err: any) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteFaq = async (id: number) => {
    if (!confirm("Yakin ingin menghapus FAQ ini?")) return;

    try {
      const res = await fetch(`http://localhost:3001/api/faqs/${id}`, {
        method: "DELETE",
        headers: {
          "x-user-id": "1",
        },
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Gagal menghapus FAQ");
      }

      fetchFaqs();
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Manajemen FAQ (Admin)</h1>

      {message && <div className="mb-4 p-3 bg-blue-100 text-blue-800 rounded">{message}</div>}

      <form onSubmit={handleAddFaq} className="bg-white p-4 shadow rounded mb-8 space-y-4">
        <h2 className="text-lg font-semibold">Tambah FAQ Baru</h2>
        <div>
          <label className="block text-sm font-medium mb-1">Pertanyaan</label>
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="w-full border p-2 rounded"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Jawaban</label>
          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            className="w-full border p-2 rounded"
            rows={3}
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Menyimpan..." : "Simpan FAQ"}
        </button>
      </form>

      <div className="bg-white p-4 shadow rounded">
        <h2 className="text-lg font-semibold mb-4">Daftar FAQ Saat Ini</h2>
        {Array.isArray(faqs) && faqs.length > 0 ? (
          <div className="space-y-4">
            {faqs.map((faq) => (
              <div key={faq.id} className="border-b pb-4 flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-gray-800">{faq.question}</h3>
                  <p className="text-gray-600 text-sm mt-1">{faq.answer}</p>
                </div>
                <button
                  onClick={() => handleDeleteFaq(faq.id)}
                  className="bg-red-500 text-white px-3 py-1 text-sm rounded hover:bg-red-600 ml-4"
                >
                  Hapus
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">Belum ada data FAQ.</p>
        )}
      </div>
    </div>
  );
}