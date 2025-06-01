const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="max-w-xl mx-auto px-2 py-6">
        <p className="text-center text-gray-300">
          © {new Date().getFullYear()} KomposKita. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;

