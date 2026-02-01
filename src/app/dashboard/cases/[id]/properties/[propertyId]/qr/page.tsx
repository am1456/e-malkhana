"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Download, Printer } from "lucide-react";
import Link from "next/link";

interface QRData {
  qrCode: string;
  propertyId: string;
  crimeNumber: string;
}

export default function QRCodePage() {
  const params = useParams();
  const caseId = params.id as string;
  const propertyId = params.propertyId as string;

  const [qrData, setQrData] = useState<QRData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQRCode();
  }, [propertyId]);

  const fetchQRCode = async () => {
    try {
      const response = await axios.get(`/api/properties/qrcode/${propertyId}`);
      setQrData(response.data.data);
    } catch (error) {
      console.error("Error fetching QR code:", error);
      alert("Failed to fetch QR code");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!qrData) return;

    const link = document.createElement("a");
    link.href = qrData.qrCode;
    link.download = `QR_${qrData.crimeNumber}_${qrData.propertyId}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-100 space-y-4">
        <div className="w-8 h-8 border-2 border-black border-t-transparent animate-spin" />
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">
          Loading QR...
        </p>
      </div>
    );
  }

  if (!qrData) {
    return <div>QR Code not found</div>;
  }

  return (
    <div>
      <div className="print:hidden">
        <Link href={`/dashboard/cases/${caseId}`}>
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Case
          </Button>
        </Link>
      </div>

      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-center">Property QR Code</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* QR Code Image */}
          <div className="flex justify-center">
            <img
              src={qrData.qrCode}
              alt="QR Code"
              className="w-64 h-64 border-4 border-gray-200 rounded"
            />
          </div>

          {/* Property Info */}
          <div className="text-center space-y-2">
            <p className="text-sm text-gray-600">Crime Number</p>
            <p className="font-bold text-lg">{qrData.crimeNumber}</p>
            <p className="text-xs text-gray-500">Property ID: {qrData.propertyId}</p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 print:hidden">
            <Button onClick={handleDownload} variant="outline" className="flex-1">
              <Download className="mr-2 h-4 w-4" /> Download
            </Button>
            <Button onClick={handlePrint} variant="default" className="flex-1">
              <Printer className="mr-2 h-4 w-4" /> Print
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print\\:block,
          .print\\:block * {
            visibility: visible;
          }
          .print\\:hidden {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}