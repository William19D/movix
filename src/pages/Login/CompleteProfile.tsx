import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import Select, { SingleValue } from 'react-select';

interface LocationState {
  user: {
    uid: string;
    email: string;
    displayName: string;
    photoURL: string;
  };
}

interface Option {
  value: number;
  label: string;
}

const CompleteProfile: React.FC = () => {
  const { state } = useLocation() as { state: LocationState };
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: state?.user.displayName || '',
  
  });

  const [departments, setDepartments] = useState<Option[]>([]);
  const [cities, setCities] = useState<Option[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState<SingleValue<Option>>(null);
  const [selectedCity, setSelectedCity] = useState<SingleValue<Option>>(null);

  useEffect(() => {
    fetch('https://api-colombia.com/api/v1/Department')
      .then(res => res.json())
      .then(data => {
        const options = data.map((d: any) => ({
          value: d.id,
          label: d.name,
        }));
        setDepartments(options);
      });
  }, []);

  useEffect(() => {
    if (selectedDepartment) {
      fetch(`https://api-colombia.com/api/v1/Department/${selectedDepartment.value}/cities`)
        .then(res => res.json())
        .then(data => {
          const options = data.map((c: any) => ({
            value: c.id,
            label: c.name,
          }));
          setCities(options);
        });
    }
  }, [selectedDepartment]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await setDoc(doc(db, 'clientes', state.user.uid), {
        name: formData.name,
        email: state.user.email,
        department: selectedDepartment?.label || '',
        city: selectedCity?.label || '',
        createdAt: new Date(),
        authProvider: 'google',
        estadoCuenta: true,
        photoURL: state.user.photoURL || '',
      });

      navigate('/User-dashboard');
    } catch (error) {
      console.error('Error al guardar perfil:', error);
      alert('Hubo un error al guardar tu perfil.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-md w-full max-w-md space-y-4"
      >
        <h1 className="text-xl font-semibold text-gray-700 text-center">Completa tu perfil</h1>

        <div>
          <label className="block mb-1 text-sm font-medium text-gray-600">Nombre completo</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium text-gray-600">Departamento</label>
          <Select
            options={departments}
            value={selectedDepartment}
            onChange={(option) => {
              setSelectedDepartment(option);
              setSelectedCity(null);
            }}
            placeholder="Selecciona un departamento"
          />
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium text-gray-600">Municipio</label>
          <Select
            options={cities}
            value={selectedCity}
            onChange={(option) => setSelectedCity(option)}
            placeholder="Selecciona un municipio"
            isDisabled={!selectedDepartment}
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
        >
          Guardar perfil
        </button>
      </form>
    </div>
  );
};

export default CompleteProfile;
