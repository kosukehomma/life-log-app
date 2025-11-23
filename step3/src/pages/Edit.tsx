import { useParams } from 'react-router-dom';

const Edit = () => {
  const { id } = useParams();

  return (
    <div className="ml-56 p-6">
      <h2>編集画面 id: {id}</h2>
    </div>
  );
};

export default Edit;
