// Improved PDFGenerator.js - Professional Quote Design with CTA, No Upper Right Contact
import jsPDF from 'jspdf';

export const generateAerationPDF = (formData, estimate) => {
  console.log("Generating professional PDF");
  try {
    // Create a new document
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 15;
    let yPos = margin;

    // Header Section
    doc.setFillColor(34, 139, 34); // Forest Green background
    doc.rect(0, 0, pageWidth, 35, 'F');
    doc.setFontSize(24);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(255, 255, 255); // White text
    const title = `${formData.propertyName ? `${formData.propertyName} - ` : ''}Lawn Aeration Quote`;
    doc.text(title, pageWidth / 2, 20, { align: 'center' });
    doc.setFontSize(10);
    doc.setFont("helvetica", "italic");
    const date = `Generated on ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`;
    doc.text(date, pageWidth / 2, 30, { align: 'center' });
    doc.setTextColor(0, 0, 0); // Reset to black

    // Line separator
    yPos = 50;
    doc.setLineWidth(0.5);
    doc.setDrawColor(150, 150, 150);
    doc.line(margin, yPos, pageWidth - margin, yPos);

    // Lawn Details Section
    yPos += 10;
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Lawn Details", margin, yPos);
    yPos += 8;

    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    const yardSizeConversion = formData.sizeUnit === 'sqft'
      ? `${formData.yardSize.toLocaleString()} sq. ft. (${(formData.yardSize / 43560).toFixed(3)} acres)`
      : `${formData.yardSize} acres (${(formData.yardSize * 43560).toLocaleString()} sq. ft.)`;
    const lawnDetails = [
      `Yard Size: ${yardSizeConversion}`,
      `Soil Type: ${formData.soilType || "Not specified"}`,
      `Lawn Condition: ${formData.lawnCondition || "Normal"}`,
      `Lawn Slope: ${formData.slope || "Flat (0-2%)"}`
    ];
    lawnDetails.forEach(detail => {
      doc.text(detail, margin + 5, yPos);
      yPos += 7;
    });

    // Cost Breakdown Section
    yPos += 10;
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Cost Breakdown", margin, yPos);
    yPos += 8;

    // Cost Table Setup
    const costItems = [];
    costItems.push(["Base Aeration Cost", `$${estimate.basePrice.toFixed(2)}`]);

    if (estimate.soilAdjustment > 0) {
      costItems.push([`Soil Type Adjustment (${formData.soilType})`, `$${estimate.soilAdjustment.toFixed(2)}`]);
    }
    if (estimate.conditionAdjustment > 0) {
      costItems.push([`Lawn Condition Adjustment (${formData.lawnCondition})`, `$${estimate.conditionAdjustment.toFixed(2)}`]);
    }
    if (estimate.slopeAdjustment > 0) {
      costItems.push([`Slope Adjustment (${formData.slope})`, `$${estimate.slopeAdjustment.toFixed(2)}`]);
    }
    if (formData.additionalServices.fertilization) {
      const fertCost = (formData.sizeUnit === 'sqft' ? formData.yardSize : formData.yardSize * 43560) * 0.02; // Placeholder
      costItems.push(["Fertilization", `$${fertCost.toFixed(2)}`]);
    }
    if (formData.additionalServices.overseeding) {
      const seedCost = (formData.sizeUnit === 'sqft' ? formData.yardSize : formData.yardSize * 43560) * 0.03; // Placeholder
      costItems.push(["Overseeding", `$${seedCost.toFixed(2)}`]);
    }

    // Draw Cost Table Manually
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    const tableWidth = pageWidth - (margin * 2);
    const col1Width = tableWidth * 0.7;
    const col2Width = tableWidth * 0.3;
    let tableYStart = yPos;

    costItems.forEach(([description, amount]) => {
      doc.text(description, margin + 5, yPos + 5);
      doc.text(amount, pageWidth - margin - 5, yPos + 5, { align: 'right' });
      yPos += 8;
    });

    // Total Cost Box
    yPos += 5;
    doc.setFillColor(240, 253, 244); // Light green background
    doc.rect(margin, yPos, tableWidth, 15, 'F');
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(34, 139, 34); // Green text
    doc.text("Total Estimated Cost:", margin + 5, yPos + 10);
    doc.text(`$${estimate.totalPrice.toFixed(2)}`, pageWidth - margin - 5, yPos + 10, { align: 'right' });
    doc.setTextColor(0, 0, 0);

    // Recommendations Section
    yPos += 25;
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Recommendations", margin, yPos);
    yPos += 8;

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    const recommendations = [
      `Soil: ${formData.soilType || "Not specified"} soil will benefit from aeration.`,
      `Condition: Maintain ${formData.lawnCondition || "normal"} status with regular care.`,
      "Consider fertilization for enhanced nutrient uptake.",
      "Overseeding post-aeration can thicken your lawn."
    ]; // Replace with generateRecommendations(formData) if available
    doc.text(recommendations.join('\n'), margin + 5, yPos, { maxWidth: tableWidth - 10 });

    // Contact Information and CTA Section
    yPos += 40; // Adjust based on recommendation length
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Schedule Your Lawn Aeration Now!", margin, yPos);
    yPos += 8;

    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    const contactInfo = [
      formData.name ? `Name/Business: ${formData.name}` : "",
      formData.email ? `Email: ${formData.email}` : "",
      formData.phone ? `Phone: ${formData.phone}` : "",
      formData.address ? `Address: ${formData.address}` : ""
    ].filter(Boolean);

    if (contactInfo.length > 0) {
      doc.text("Contact us to book your service:", margin + 5, yPos);
      yPos += 7;
      contactInfo.forEach(info => {
        doc.text(info, margin + 5, yPos);
        yPos += 7;
      });
    } else {
      doc.text("Contact your lawn care provider to schedule!", margin + 5, yPos);
    }

    // Footer
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    const footerText = "This quote is valid for 30 days. Contact us to confirm pricing and availability.";
    doc.text(footerText, pageWidth / 2, pageHeight - 10, { align: 'center' });

    // Save the PDF
    const filename = `${formData.propertyName ? formData.propertyName.replace(/\s+/g, '-').toLowerCase() + '-' : ''}lawn-aeration-quote.pdf`;
    doc.save(filename);
    console.log("PDF generated and saved successfully");

  } catch (error) {
    console.error("Error generating PDF:", error);
  }
};