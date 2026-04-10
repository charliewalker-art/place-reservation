import jsPDF from 'jspdf';
import type { RecuDTO } from '../types/reservation';

export const generatePdf = (recu: RecuDTO) => {
  // Format A4 pour avoir plus de place pour ce design
  const doc = new jsPDF('p', 'mm', 'a4');
 // const pageWidth = doc.internal.pageSize.getWidth();

  // Couleurs (inspirées du design)
  const primary = '#1d4ed8'; // Bleu
  const textDark = '#0f172a';
  const textMuted = '#64748b';
  const bgCard = '#f8fafc'; // Gris très clair pour les cartes

  // ---- HEADER (FleetFlow Pro) ----
  doc.setFillColor(primary);
  doc.roundedRect(15, 15, 10, 10, 2, 2, 'F');
  doc.setTextColor('#ffffff');
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('F', 20, 22, { align: 'center' });

  doc.setTextColor(textDark);
  doc.setFontSize(14);
  doc.text('FleetFlow Pro', 30, 22);

  // ---- TITRE ----
  doc.setFontSize(20);
  doc.text(`REÇU DE RÉSERVATION N°${recu.idReserv}`, 15, 45);

  // ---- DATES ----
  doc.setFontSize(8);
  doc.setTextColor(textMuted);
  doc.text('DATE RÉSERVATION', 15, 55);
  doc.text('DATE VOYAGE', 60, 55);

  doc.setFontSize(10);
  doc.setTextColor(textDark);
  doc.text(recu.dateReserv || '-', 15, 60);
  doc.setTextColor(primary);
  doc.text(recu.dateVoyage || '-', 60, 60);

  // ---- CARTES INFORMATIONS ----
  // Fond carte Client
  doc.setFillColor(bgCard);
  doc.roundedRect(15, 75, 85, 40, 3, 3, 'F');
  // Fond carte Voyage
  doc.roundedRect(110, 75, 85, 40, 3, 3, 'F');

  // Contenu carte Client
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

  // Contenu carte Voyage
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

  // ---- DÉTAIL DU PAIEMENT ----
  doc.setFontSize(8);
  doc.setTextColor(textMuted);
  doc.text('DÉTAIL DU PAIEMENT', 15, 135);

  // Tableau paiement
  doc.setFillColor(bgCard);
  doc.roundedRect(15, 140, 180, 50, 3, 3, 'F');

  // En-têtes tableau
  doc.setFontSize(8);
  doc.text('DÉSIGNATION', 20, 148);
  doc.text('MONTANT', 190, 148, { align: 'right' });

  doc.setDrawColor(226, 232, 240); // Ligne séparatrice
  doc.line(15, 152, 195, 152);

  // Ligne 1 : Frais
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
  doc.text(`${recu.frais.toLocaleString()} Ar`, 190, 160, { align: 'right' });

  // Ligne 2 : Avance
  doc.setFont('helvetica', 'bold');
  doc.text('Mode de paiement', 20, 172);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor('#059669'); // Vert (emerald-600)
  doc.text(recu.payment.replace('_', ' '), 20, 176);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(textMuted);
  doc.text(`- ${recu.montantAvance.toLocaleString()} Ar`, 190, 172, { align: 'right' });

  doc.line(15, 180, 195, 180);

  // Total
  doc.setFillColor('#eff6ff'); // Fond bleuté
  doc.rect(15, 180, 180, 10, 'F'); // Remplissage bas du tableau
  
  doc.setTextColor(primary);
  doc.setFont('helvetica', 'bold');
  doc.text('RESTE À PAYER', 20, 186);
  
  doc.setFontSize(12);
  doc.text(`${recu.resteAPayer.toLocaleString()} Ar`, 190, 187, { align: 'right' });

  // Télécharger le PDF
  doc.save(`recu-${recu.idReserv}.pdf`);
};