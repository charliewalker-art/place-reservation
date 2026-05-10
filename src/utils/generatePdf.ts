import jsPDF from 'jspdf';
import type { RecuDTO } from '../types/reservation';

const formatDateFr = (dateStr: string | null | undefined): string => {
  if (!dateStr) return '-';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  return date.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
};

const formatDateHeureFr = (dateStr: string | null | undefined): string => {
  if (!dateStr) return '-';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  return date.toLocaleString('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const generatePdf = (recu: RecuDTO) => {
  const doc = new jsPDF('p', 'mm', 'a4');

  const primary = '#1d4ed8';
  const textDark = '#0f172a';
  const textMuted = '#64748b';
  const bgCard = '#f8fafc';

  // ---- HEADER ----
  doc.setFillColor(primary);
  doc.roundedRect(15, 15, 10, 10, 2, 2, 'F');

  doc.setDrawColor('#ffffff');
  doc.setLineWidth(0.3);
  doc.rect(16.5, 18, 4.5, 3, 'S');
  doc.rect(21.2, 19, 2, 2, 'S');
  doc.circle(17.5, 21.5, 0.6, 'S');
  doc.circle(21.5, 21.5, 0.6, 'S');
  doc.line(21, 21, 21.2, 21);

  doc.setTextColor(primary);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Places Cooperative', 30, 22);

  // ---- TITRE ----
  doc.setTextColor(textDark);
  doc.setFontSize(20);
  doc.text(`REÇU DE RÉSERVATION N°${recu.idReserv}`, 15, 45);

  // ---- DATES en français ----
  doc.setFontSize(8);
  doc.setTextColor(textMuted);
  doc.text('DATE RÉSERVATION', 15, 55);
  doc.text('DATE VOYAGE', 60, 55);

  doc.setFontSize(10);
  doc.setTextColor(textDark);
  doc.text(formatDateHeureFr(recu.dateReserv), 15, 60);
  doc.setTextColor(primary);
  doc.text(formatDateFr(recu.dateVoyage), 60, 60);

  // ---- CARTES ----
  doc.setFillColor(bgCard);
  doc.roundedRect(15, 75, 85, 40, 3, 3, 'F');
  doc.roundedRect(110, 75, 85, 40, 3, 3, 'F');

  // Client
  doc.setFontSize(8);
  doc.setTextColor(textMuted);
  doc.text('INFORMATION CLIENT', 20, 83);
  doc.setFontSize(7);
  doc.text('NOM DU PASSAGER', 20, 93);
  doc.setFontSize(11);
  doc.setTextColor(textDark);
  doc.text(recu.nomClient, 20, 98);
  doc.setFontSize(7);
  doc.setTextColor(textMuted);
  doc.text('CONTACT', 20, 106);
  doc.setFontSize(10);
  doc.setTextColor(textDark);
  doc.text(recu.contact, 20, 111);

  // Voyage
  doc.setFontSize(8);
  doc.setTextColor(textMuted);
  doc.text('DÉTAILS DU VOYAGE', 115, 83);
  doc.setFontSize(7);
  doc.text('VÉHICULE', 115, 93);
  doc.setFontSize(11);
  doc.setTextColor(textDark);
  doc.text(`Voiture N°${recu.idVoiture}`, 115, 98);
  doc.setFontSize(7);
  doc.setTextColor(textMuted);
  doc.text('SIÈGE', 115, 106);
  doc.setFontSize(10);
  doc.setTextColor(textDark);
  doc.text(`Place N°${recu.place}`, 115, 111);

  // ---- PAIEMENT ----
  doc.setFontSize(8);
  doc.setTextColor(textMuted);
  doc.text('DÉTAIL DU PAIEMENT', 15, 135);

  doc.setFillColor(bgCard);
  doc.roundedRect(15, 140, 180, 50, 3, 3, 'F');

  doc.setFontSize(8);
  doc.text('DESCRIPTION', 20, 148);
  doc.text('MONTANT', 190, 148, { align: 'right' });

  doc.setDrawColor(226, 232, 240);
  doc.line(15, 152, 195, 152);

  // Frais
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(textDark);
  doc.text('Frais de transport', 20, 160);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(textMuted);
  doc.text('Trajet standard premium', 20, 164);
  doc.setFontSize(10);
  doc.setTextColor(textDark);
  doc.text(`${recu.frais.toLocaleString('fr-FR')} Ar`, 190, 160, { align: 'right' });

  // Paiement
  doc.setFont('helvetica', 'bold');
  doc.text('Mode de paiement', 20, 172);
  doc.setFontSize(8);
  doc.setTextColor('#059669');
  doc.text(recu.payment.replace('_', ' '), 20, 176);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(textMuted);
  doc.text(`- ${recu.montantAvance.toLocaleString('fr-FR')} Ar`, 190, 172, { align: 'right' });

  doc.line(15, 180, 195, 180);

  // Total
  doc.setFillColor('#eff6ff');
  doc.rect(15, 180, 180, 10, 'F');
  doc.setTextColor(primary);
  doc.setFont('helvetica', 'bold');
  doc.text('RESTE À PAYER', 20, 186);
  doc.setFontSize(12);
  doc.text(`${recu.resteAPayer.toLocaleString('fr-FR')} Ar`, 190, 187, { align: 'right' });

  doc.save(`recu-${recu.idReserv}.pdf`);
};