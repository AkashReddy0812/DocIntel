export async function uploadPDF(file: File) {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch("/api/upload-pdf", {
    method: "POST",
    body: formData,
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.detail || "Upload failed");
  }

  return data;
}
export async function askChat(question: string) {
  const res = await fetch("/api/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ question }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Chat request failed");
  }

  return res.json(); // { answer }
}
export async function getDocuments() {
  const res = await fetch("/api/documents");
  if (!res.ok) throw new Error("Failed to fetch documents");
  return res.json();
}

export async function getInsights(docId: string) {
  const res = await fetch(`/api/insights/${docId}`);

  if (!res.ok) {
    throw new Error("Failed to fetch insights");
  }

  return res.json();
}