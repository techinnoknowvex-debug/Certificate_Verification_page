import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "./supabaseClient";
import logo from "./assets/logo.png";

function VerifyPage() {
  const { id } = useParams();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchCertificate = async () => {
      const { data, error } = await supabase
        .from("certificates")
        .select("*")
        .eq("short_id", id)
        .single();

      if (error || !data) setError("Certificate not found");
      else {
        setData(data);
      }

      setLoading(false);
    };

    fetchCertificate();
  }, [id]);

  if (loading) return <p className="text-center mt-20">Loading...</p>;
  if (error) return <p className="text-center mt-20 text-red-500">{error}</p>;

  const currentUrl = window.location.href;

  const handleDownload = async () => {
    const response = await fetch(data.certificate_url);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${data.name}_certificate.png`;
    a.click();
  };

  const handleAddToLinkedInProfile = () => {
    const issueDate = new Date(data.issue_date);
    const year = issueDate.getFullYear();
    const month = issueDate.getMonth() + 1;

    const linkedInUrl = `https://www.linkedin.com/profile/add?startTask=CERTIFICATION_NAME&name=${encodeURIComponent(data.course)}&organizationName=${encodeURIComponent(data.issuer)}&issueYear=${year}&issueMonth=${month}&certId=${encodeURIComponent(data.certificate_id)}&certUrl=${encodeURIComponent(currentUrl)}`;

    window.open(linkedInUrl, "_blank");
  };

  return (
    <div className="bg-gray-50 min-h-screen font-sans text-gray-800">

      {/* HEADER */}
      <header className="bg-white shadow-sm border-b py-4 text-center">
        <img src={logo} alt="Logo" className="h-10 mx-auto mb-2" />
        <h1 className="font-semibold tracking-wide">
          Innoknowvex Edutech Pvt Ltd
        </h1>
        <p className="text-xs text-gray-500 uppercase">
          Certificate Verification 
        </p>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12 space-y-12">

        {/* VERIFIED BADGE */}
        <div className="flex items-center justify-center gap-3">
          <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
            ✓
          </div>
          <span className="text-green-700 font-semibold uppercase tracking-wider">
            Certified & Verified
          </span>
        </div>

        {/* CERTIFICATE IMAGE */}
        <div className="flex flex-col items-center">
          <img
            src={data.certificate_url}
            alt="Certificate"
            className="rounded-xl shadow-lg border max-h-[600px]"
          />
          <p className="mt-4 text-gray-600 text-sm uppercase tracking-wide font-semibold">
            Innoknowvex {data.certificate_type} Certificate
          </p>
        </div>

        {/* ISSUANCE DETAILS */}
        <section className="bg-white p-5 rounded-lg shadow border">
          <h3 className="text-orange-500 uppercase text-sm font-semibold mb-4">
            Issuance Details
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <Detail label="Recipient" value={data.name} />
            <Detail label="Issued By" value={data.issuer} />
            <Detail label="Issue Date" value={data.issue_date} />
          </div>
        </section>

        {/* COURSE DETAILS */}
        <section className="bg-white p-5 rounded-lg shadow border">
          <h3 className="text-orange-500 uppercase text-sm font-semibold mb-4">
            Course Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-5">
            <Detail label="Course Name" value={data.course} />
            <Detail label="Start Date" value={data.start_date} />
            <Detail label="End Date" value={data.end_date} />
            <Detail label="Duration" value={data.duration} />
          </div>

          <p className="text-gray-700 leading-relaxed text-sm">
            This certificate acknowledges successful completion of the {data.course} course offered by {data.issuer}. The recipient has demonstrated commitment, dedication, and proficiency in the program's curriculum. This certification is a testament to their professional growth and expertise in the subject matter. We are pleased to recognize this outstanding achievement and wish them continued success in their professional endeavors.
          </p>
        </section>

        {/* SHARE & ACTIONS */}
        <section className="bg-white p-5 rounded-lg shadow border">
          <div className="flex flex-col md:flex-row md:justify-between items-center gap-4">
            <div className="text-center">
              <h3 className="text-orange-500 uppercase text-sm font-semibold mb-3">
                Share Certificate
              </h3>
              <div className="flex justify-center gap-6 items-center">
                <img
                  src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/facebook/facebook-original.svg"
                  alt="Facebook"
                  className="h-8 w-8 cursor-pointer hover:scale-110 transition"
                  onClick={() =>
                    window.open(
                      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`,
                      "_blank"
                    )
                  }
                />
                <img
                  src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/twitter/twitter-original.svg"
                  alt="Twitter"
                  className="h-8 w-8 cursor-pointer hover:scale-110 transition"
                  onClick={() =>
                    window.open(
                      `https://twitter.com/intent/tweet?url=${encodeURIComponent(currentUrl)}`,
                      "_blank"
                    )
                  }
                />
                <img
                  src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linkedin/linkedin-original.svg"
                  alt="LinkedIn"
                  className="h-8 w-8 cursor-pointer hover:scale-110 transition"
                  onClick={() =>
                    window.open(
                      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}`,
                      "_blank"
                    )
                  }
                />
              </div>
            </div>

            <div className="text-center">
              <h3 className="text-orange-500 uppercase text-sm font-semibold mb-3">
                Actions
              </h3>
              <div className="flex flex-col sm:flex-row sm:gap-4">
                <button
                  onClick={handleDownload}
                  className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-6 rounded-lg text-sm mb-2 sm:mb-0"
                >
                  Download
                </button>
                <button
                  onClick={handleAddToLinkedInProfile}
                  className="border border-[#0A66C2] text-[#0A66C2] hover:bg-[#0A66C2] hover:text-white font-semibold py-2 px-6 rounded-lg text-sm"
                >
                  Add to Linked In Profile
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* VALIDATE BUTTON */}
        <section className="text-center">
          <button
            onClick={() => setShowModal(true)}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-lg text-sm"
          >
            Validate Certificate
          </button>
        </section>

      </main>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white rounded-xl p-8 shadow-xl text-center w-96">
            <div className="text-green-600 text-4xl mb-4">✓</div>
            <h2 className="text-xl font-semibold mb-2">
              Certificate Successfully Verified
            </h2>

            <p className="text-gray-500 text-sm mb-1">Certificate ID</p>
            <p className="font-mono font-semibold text-gray-800">
              {data.certificate_id}
            </p>

            <button
              onClick={() => setShowModal(false)}
              className="mt-6 bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg"
            >
              Close
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

function Detail({ label, value, mono }) {
  return (
    <div>
      <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">{label}</p>
      <p className={`font-semibold text-gray-800 text-sm ${mono ? "font-mono" : ""}`}>
        {value || "-"}
      </p>
    </div>
  );
}

export default VerifyPage;