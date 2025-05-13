
import React, { useState } from "react";
import QrReader from "react-qr-scanner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Scan, ScanX } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface QRScannerProps {
  onScanSuccess: (result: string) => void;
}

const QRScanner: React.FC<QRScannerProps> = ({ onScanSuccess }) => {
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleScan = (data: { text: string } | null) => {
    if (data?.text) {
      toast({
        title: "QR Code Detected",
        description: "Processing scan result...",
      });
      onScanSuccess(data.text);
    }
  };

  const handleError = (err: Error) => {
    console.error("QR Scanner error:", err);
    setError("Camera access error. Please check permissions and try again.");
  };

  return (
    <div className="space-y-4">
      <div className="rounded-lg overflow-hidden relative">
        {/* Scanner frame overlay */}
        <div className="absolute inset-0 border-2 border-blue-400 rounded-lg z-10 pointer-events-none">
          <div className="absolute top-0 left-0 w-12 h-12 border-t-4 border-l-4 border-blue-500 rounded-tl-lg"></div>
          <div className="absolute top-0 right-0 w-12 h-12 border-t-4 border-r-4 border-blue-500 rounded-tr-lg"></div>
          <div className="absolute bottom-0 left-0 w-12 h-12 border-b-4 border-l-4 border-blue-500 rounded-bl-lg"></div>
          <div className="absolute bottom-0 right-0 w-12 h-12 border-b-4 border-r-4 border-blue-500 rounded-br-lg"></div>
        </div>
        
        <div className="flex justify-center items-center">
          <QrReader
            delay={300}
            onError={handleError}
            onScan={handleScan}
            constraints={{
              video: { facingMode: "environment" }
            }}
            className="w-full max-w-sm mx-auto"
            style={{ width: '100%' }}
          />
        </div>
      </div>

      <div className="text-center text-sm text-gray-600">
        <div className="flex items-center justify-center mb-2">
          <Scan className="mr-2 h-4 w-4" />
          <span>Position QR code within the frame</span>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <ScanX className="h-4 w-4 mr-2" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default QRScanner;
