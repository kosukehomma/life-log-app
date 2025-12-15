import { useNavigate } from 'react-router-dom';

const AddButton = () => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => void navigate('/add')}
      className="
        fixed bottom-6 right-6
        bg-primary text-white
        w-14 h-14 rounded-full
        shadow-lg text-3xl
        flex items-center justify-center
        hover:bg-primary/80 transition
      "
    >
      +
    </button>
  );
};

export default AddButton;
