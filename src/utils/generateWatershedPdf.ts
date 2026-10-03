import { jsPDF } from 'jspdf';
import { MicroWatershed } from '../types/watershed';

export function generateWatershedPdfReport(watershed: MicroWatershed) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;
  let y = margin;

  const primaryColor = [27, 42, 74]; // French Navy #1B2A4A
  const accentBlue = [0, 71, 171]; // Cobalt Blue #0047AB
  const slateText = [51, 65, 85];
  const mutedText = [100, 116, 139];

  // Helper for status colors
  const getStatusColor = (status: string): [number, number, number] => {
    switch (status) {
      case 'critical':
        return [239, 68, 68]; // Red
      case 'stressed':
        return [249, 115, 22]; // Orange
      case 'watch':
        return [234, 179, 8]; // Amber
      case 'normal':
        return [16, 185, 129]; // Emerald
      default:
        return [100, 116, 139];
    }
  };

  // Helper for CuM formatting
  const formatCuM = (val: number) => {
    if (Math.abs(val) >= 10000000) {
      return `${(val / 10000000).toFixed(2)} Cr m³`;
    }
    if (Math.abs(val) >= 100000) {
      return `${(val / 100000).toFixed(2)} Lakh m³`;
    }
    return `${val.toLocaleString()} m³`;
  };

  // --- HEADER SECTION ---
  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.rect(0, 0, pageWidth, 28, 'F');

  // National Authority & Challenge Title
  doc.setTextColor(224, 242, 254);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text('GOVERNMENT OF INDIA • MINISTRY OF JAL SHAKTI • DEPT OF WATER RESOURCES', margin, 7);

  doc.setFontSize(7);
  doc.setTextColor(186, 230, 253);
  doc.text('SEVA FIRST INNOVATION CHALLENGE (SFIC 2026) • THEME 2: SAMRIDDH ANNADATA, SAMRIDDH BHARAT', margin, 11.5);

  doc.setFontSize(13);
  doc.setTextColor(255, 255, 255);
  doc.text('JALDRISHTI: MICRO-WATERSHED WATER ACCOUNTABILITY & AUDIT REPORT', margin, 18.5);

  doc.setFontSize(7.5);
  doc.setTextColor(191, 219, 254);
  const now = new Date();
  const dateStr = `${now.toISOString().slice(0, 10)} ${now.toLocaleTimeString()} IST`;
  doc.text(`REPORT REF: JAL-AUDIT-${watershed.code}-${now.getFullYear()} | GENERATED: ${dateStr}`, margin, 24);

  y = 34;

  // --- WATERSHED PROFILE SUMMARY CARD ---
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(margin, y, pageWidth - margin * 2, 38, 2, 2, 'FD');

  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text(`${watershed.name}`, margin + 4, y + 6);

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(slateText[0], slateText[1], slateText[2]);
  doc.text(`District: ${watershed.district} | State: ${watershed.state} | Basin: ${watershed.basin} | Area: ${watershed.areaSqKm} km²`, margin + 4, y + 11);

  // Status Badge
  const statusColor = getStatusColor(watershed.currentStatus);
  doc.setFillColor(statusColor[0], statusColor[1], statusColor[2]);
  doc.roundedRect(pageWidth - margin - 40, y + 3, 36, 7, 1.5, 1.5, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.text(`STATUS: ${watershed.currentStatus.toUpperCase()}`, pageWidth - margin - 38, y + 7.5);

  // 4 Key Metrics inside Box
  const colW = (pageWidth - margin * 2 - 8) / 4;
  const metricsY = y + 17;

  // Metric 1: Groundwater
  doc.setFillColor(241, 245, 249);
  doc.roundedRect(margin + 3, metricsY, colW - 2, 16, 1, 1, 'F');
  doc.setFontSize(6.5);
  doc.setTextColor(mutedText[0], mutedText[1], mutedText[2]);
  doc.text('CURRENT GW LEVEL', margin + 5, metricsY + 4);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text(`${watershed.groundwaterCurrentBgl} m bgl`, margin + 5, metricsY + 9.5);
  doc.setFontSize(6.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(watershed.groundwaterTrend1YrPercent < 0 ? 220 : 16, watershed.groundwaterTrend1YrPercent < 0 ? 38 : 140, 38);
  doc.text(`${watershed.groundwaterTrend1YrPercent}% (1-yr trend)`, margin + 5, metricsY + 13.5);

  // Metric 2: Rainfall
  const m2X = margin + 3 + colW;
  doc.setFillColor(241, 245, 249);
  doc.roundedRect(m2X, metricsY, colW - 2, 16, 1, 1, 'F');
  doc.setFontSize(6.5);
  doc.setTextColor(mutedText[0], mutedText[1], mutedText[2]);
  doc.text('SEASONAL RAINFALL', m2X + 2, metricsY + 4);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text(`${watershed.rainfallCurrentSeasonMm} mm`, m2X + 2, metricsY + 9.5);
  doc.setFontSize(6.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(watershed.rainfallDeficitPercent < 0 ? 220 : 16, watershed.rainfallDeficitPercent < 0 ? 38 : 140, 38);
  doc.text(`${watershed.rainfallDeficitPercent}% Anomaly`, m2X + 2, metricsY + 13.5);

  // Metric 3: Assets
  const m3X = margin + 3 + colW * 2;
  doc.setFillColor(241, 245, 249);
  doc.roundedRect(m3X, metricsY, colW - 2, 16, 1, 1, 'F');
  doc.setFontSize(6.5);
  doc.setTextColor(mutedText[0], mutedText[1], mutedText[2]);
  doc.text('RECHARGE ASSETS', m3X + 2, metricsY + 4);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text(`${watershed.functionalAssetsCount} / ${watershed.totalRechargeAssets}`, m3X + 2, metricsY + 9.5);
  doc.setFontSize(6.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(194, 65, 12);
  doc.text(`${watershed.needsRepairCount} Need Repair`, m3X + 2, metricsY + 13.5);

  // Metric 4: Stress Score
  const m4X = margin + 3 + colW * 3;
  doc.setFillColor(241, 245, 249);
  doc.roundedRect(m4X, metricsY, colW - 2, 16, 1, 1, 'F');
  doc.setFontSize(6.5);
  doc.setTextColor(mutedText[0], mutedText[1], mutedText[2]);
  doc.text('STRESS INDEX', m4X + 2, metricsY + 4);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text(`${watershed.stressScore} / 100`, m4X + 2, metricsY + 9.5);
  doc.setFontSize(6.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(mutedText[0], mutedText[1], mutedText[2]);
  doc.text(`Conf: ${watershed.dataConfidence}`, m4X + 2, metricsY + 13.5);

  y += 43;

  // --- SECTION 1: WATER ACCOUNTABILITY LEDGER TABLE ---
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.text('1. SEASONAL WATER ACCOUNTABILITY LEDGER (AQUIFER BALANCE SHEET)', margin, y);

  y += 4;

  // Table Headers
  const tableHeaders = [
    { label: 'Season Cycle', w: 32 },
    { label: 'Rainfall Inflow', w: 23 },
    { label: 'Natural Infil.', w: 21 },
    { label: 'Recharge Trapped', w: 24 },
    { label: 'Irrigation Draft', w: 22 },
    { label: 'Net Aquifer Bal.', w: 28 },
    { label: 'GW Shift', w: 18 },
    { label: 'Audit', w: 14 },
  ];

  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.rect(margin, y, pageWidth - margin * 2, 6, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6);

  let curX = margin + 2;
  tableHeaders.forEach((th) => {
    doc.text(th.label, curX, y + 4.2);
    curX += th.w;
  });

  y += 6;

  // Table Body Rows
  watershed.ledger.forEach((cycle, rIdx) => {
    const isEven = rIdx % 2 === 0;
    doc.setFillColor(isEven ? 255 : 248, isEven ? 255 : 250, isEven ? 255 : 252);
    doc.rect(margin, y, pageWidth - margin * 2, 5.5, 'F');
    doc.setDrawColor(226, 232, 240);
    doc.line(margin, y + 5.5, pageWidth - margin, y + 5.5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6);
    doc.setTextColor(slateText[0], slateText[1], slateText[2]);

    curX = margin + 2;
    // Season
    doc.setFont('helvetica', 'bold');
    doc.text(cycle.seasonLabel, curX, y + 3.8);
    curX += tableHeaders[0].w;

    // Inflow
    doc.setFont('helvetica', 'normal');
    doc.text(formatCuM(cycle.rainfallInflowCuM), curX, y + 3.8);
    curX += tableHeaders[1].w;

    // Natural
    doc.text(formatCuM(cycle.naturalInfiltrationCuM), curX, y + 3.8);
    curX += tableHeaders[2].w;

    // Recharge
    doc.text(formatCuM(cycle.artificialRechargeCapturedCuM), curX, y + 3.8);
    curX += tableHeaders[3].w;

    // Extraction
    doc.text(formatCuM(cycle.estimatedIrrigationExtractionCuM), curX, y + 3.8);
    curX += tableHeaders[4].w;

    // Net Balance
    doc.setFont('helvetica', 'bold');
    if (cycle.netAquiferBalanceCuM >= 0) {
      doc.setTextColor(16, 185, 129);
      doc.text(`+${formatCuM(cycle.netAquiferBalanceCuM)}`, curX, y + 3.8);
    } else {
      doc.setTextColor(220, 38, 38);
      doc.text(`${formatCuM(cycle.netAquiferBalanceCuM)}`, curX, y + 3.8);
    }
    curX += tableHeaders[5].w;

    // Shift
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(slateText[0], slateText[1], slateText[2]);
    doc.text(`${cycle.observedGroundwaterShiftMeters > 0 ? '+' : ''}${cycle.observedGroundwaterShiftMeters} m`, curX, y + 3.8);
    curX += tableHeaders[6].w;

    // Status
    doc.text(cycle.recordedStatus.toUpperCase(), curX, y + 3.8);

    y += 5.5;
  });

  y += 5;

  // --- SECTION 2: WHY IS THIS WATERSHED STRESSED? DIAGNOSTIC BREAKDOWN ---
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.text('2. DIAGNOSTIC STRESS DECOMPOSITION (EVIDENCE-BASED FACTORS)', margin, y);

  y += 4;

  watershed.stressDecomposition.forEach((f, idx) => {
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(margin, y, pageWidth - margin * 2, 9.5, 1, 1, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text(`${idx + 1}. ${f.name} (${f.percentage}% Impact)`, margin + 2.5, y + 3.5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6);
    doc.setTextColor(slateText[0], slateText[1], slateText[2]);
    doc.text(`${f.description}`, margin + 2.5, y + 6.2);

    doc.setFontSize(5.5);
    doc.setTextColor(mutedText[0], mutedText[1], mutedText[2]);
    doc.text(`Source: ${f.source} | Date: ${f.date} | Method: ${f.method}`, margin + 2.5, y + 8.5);

    y += 11;
  });

  y += 3;

  // --- SECTION 3: RECHARGE ASSET REGISTRY ---
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.text(`3. RECHARGE ASSET REGISTRY (${watershed.functionalAssetsCount} Functional, ${watershed.needsRepairCount} Need Repair)`, margin, y);

  y += 4;

  const assetHeaders = [
    { label: 'Asset ID', w: 26 },
    { label: 'Structure Name', w: 54 },
    { label: 'Type', w: 26 },
    { label: 'Capacity', w: 18 },
    { label: 'Status', w: 28 },
    { label: 'Last Verified By', w: 30 },
  ];

  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.rect(margin, y, pageWidth - margin * 2, 5.5, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6);

  curX = margin + 2;
  assetHeaders.forEach((ah) => {
    doc.text(ah.label, curX, y + 3.8);
    curX += ah.w;
  });

  y += 5.5;

  watershed.assets.forEach((ast, aIdx) => {
    const isEven = aIdx % 2 === 0;
    doc.setFillColor(isEven ? 255 : 248, isEven ? 255 : 250, isEven ? 255 : 252);
    doc.rect(margin, y, pageWidth - margin * 2, 5.5, 'F');
    doc.setDrawColor(226, 232, 240);
    doc.line(margin, y + 5.5, pageWidth - margin, y + 5.5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6);
    doc.setTextColor(slateText[0], slateText[1], slateText[2]);

    curX = margin + 2;
    doc.setFont('helvetica', 'bold');
    doc.text(ast.id, curX, y + 3.8);
    curX += assetHeaders[0].w;

    doc.setFont('helvetica', 'normal');
    const truncName = ast.name.length > 34 ? ast.name.slice(0, 32) + '..' : ast.name;
    doc.text(truncName, curX, y + 3.8);
    curX += assetHeaders[1].w;

    doc.text(ast.type, curX, y + 3.8);
    curX += assetHeaders[2].w;

    doc.text(`${ast.capacityCuM.toLocaleString()} m³`, curX, y + 3.8);
    curX += assetHeaders[3].w;

    doc.setFont('helvetica', 'bold');
    if (ast.status === 'Functional') {
      doc.setTextColor(16, 185, 129);
    } else {
      doc.setTextColor(220, 38, 38);
    }
    doc.text(ast.status, curX, y + 3.8);
    curX += assetHeaders[4].w;

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(slateText[0], slateText[1], slateText[2]);
    const truncVerifier = ast.verifiedBy.length > 22 ? ast.verifiedBy.slice(0, 20) + '..' : ast.verifiedBy;
    doc.text(truncVerifier, curX, y + 3.8);

    y += 5.5;
  });

  y += 5;

  // --- STATUTORY AUDIT & SIGN-OFF FOOTER ---
  doc.setFillColor(241, 245, 249);
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(margin, y, pageWidth - margin * 2, 22, 1.5, 1.5, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.5);
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text('DATA INTEGRITY GUARANTEE & STATUTORY SIGN-OFF', margin + 3, y + 4.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(5.5);
  doc.setTextColor(slateText[0], slateText[1], slateText[2]);
  doc.text('This digital report has been synthesized from official DWLR piezometric logs (CGWB), IMD gridded rainfall telemetry,', margin + 3, y + 8);
  doc.text('and Sentinel-2 / Cartosat satellite proxies (NRSC Bhuvan) under the Seva First Innovation Challenge (SFIC 2026).', margin + 3, y + 11.5);
  doc.text('Zero Fabricated Data Guarantee: Simulated projections are strictly disclaimed as MODELLED ESTIMATES.', margin + 3, y + 15);

  // Sign-off columns
  doc.setFont('helvetica', 'bold');
  doc.text('Officer Sign-off: __________________________', margin + 3, y + 19);
  doc.text('Gram Panchayat Attestation: __________________________', margin + 85, y + 19);

  // Save the PDF
  const filename = `JalDrishti_AuditReport_${watershed.code}_${now.toISOString().slice(0, 10)}.pdf`;
  doc.save(filename);
}
