"use client";

import { useState } from "react";

type FormStatus = "idle" | "sending" | "success" | "error";

type ContactFormProps = {
  showIntro?: boolean;
  showLabels?: boolean;
};

export default function ContactForm({
  showIntro = true,
  showLabels = false,
}: ContactFormProps) {
  const [status, setStatus] = useState<FormStatus>("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    setMessage("");

    const form = event.currentTarget;
    const formData = new FormData(form);
    if (formData.get("botcheck")) {
      setStatus("error");
      setMessage("No pudimos enviar tu mensaje. Probá de nuevo.");
      return;
    }
    formData.append("access_key", process.env.NEXT_PUBLIC_WEB3FORMS_KEY ?? "");
    formData.append("subject", "Nuevo mensaje desde el formulario de contacto");
    formData.append("from_name", "Almendra Estudio Digital");
    formData.append("replyto", String(formData.get("email") ?? ""));
    formData.append("redirect", "false");

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("send_failed");
      }

      form.reset();
      setStatus("success");
      setMessage("Mensaje enviado");
      window.setTimeout(() => {
        setStatus("idle");
        setMessage("");
      }, 2500);
    } catch (error) {
      setStatus("error");
      setMessage("No pudimos enviar tu mensaje. Probá de nuevo.");
    }
  }

  return (
    <>
      {showIntro && (
        <p className="body-copy mb-4 text-center text-base text-almond-700">
          También podés escribirnos por acá
        </p>
      )}
      <form onSubmit={handleSubmit} className="flex w-full flex-col gap-3">
        <input
          type="text"
          name="botcheck"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          className="hidden"
        />
        <div className="flex flex-col gap-1">
          {showLabels && (
            <label className="body-copy text-sm text-[#BF8271]" htmlFor="nombre">
              Nombre
            </label>
          )}
          <input
            id="nombre"
            type="text"
            name="nombre"
            placeholder={showLabels ? undefined : "Nombre"}
            required
            className="w-full rounded-lg border border-[#BF8271] bg-white/80 px-4 py-3 text-sm text-almond-700 placeholder:text-[#B89283] focus:outline-none focus:ring-1 focus:ring-[#BF8271]"
          />
        </div>
        <div className="flex flex-col gap-1">
          {showLabels && (
            <label className="body-copy text-sm text-[#BF8271]" htmlFor="email">
              Email
            </label>
          )}
          <input
            id="email"
            type="email"
            name="email"
            placeholder={showLabels ? undefined : "Email"}
            required
            className="w-full rounded-lg border border-[#BF8271] bg-white/80 px-4 py-3 text-sm text-almond-700 placeholder:text-[#B89283] focus:outline-none focus:ring-1 focus:ring-[#BF8271]"
          />
        </div>
        <div className="flex flex-col gap-1">
          {showLabels && (
            <label className="body-copy text-sm text-[#BF8271]" htmlFor="mensaje">
              Mensaje / Consulta
            </label>
          )}
          <textarea
            id="mensaje"
            name="mensaje"
            placeholder={showLabels ? undefined : "Mensaje / Consulta"}
            rows={4}
            required
            className="w-full resize-none rounded-lg border border-[#BF8271] bg-white/80 px-4 py-3 text-sm text-almond-700 placeholder:text-[#B89283] focus:outline-none focus:ring-1 focus:ring-[#BF8271]"
          />
        </div>
        <button
          type="submit"
          disabled={status === "sending"}
          className="mt-2 w-full rounded-lg bg-[#BF8271] px-4 py-3 text-sm text-white disabled:opacity-70"
        >
          {status === "sending" ? "Enviando..." : "Enviar consulta"}
        </button>
      </form>

      {status === "success" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-6">
          <div className="w-full max-w-sm rounded-2xl bg-white px-6 py-5 text-center text-sm text-almond-700 shadow-lg">
            {message}
          </div>
        </div>
      )}
      {status === "error" && (
        <p className="mt-3 text-center text-sm text-[#A35B5B]">{message}</p>
      )}
    </>
  );
}
