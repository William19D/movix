import React, { useState, useEffect } from 'react';
import Select, { SingleValue } from 'react-select';

interface Option {
  value: number;
  label: string;
}

export default function Register() {
  const [departamentos, setDepartamentos] = useState<Option[]>([]);
  const [municipios, setMunicipios] = useState<Option[]>([]);
  const [selectedDepartamento, setSelectedDepartamento] = useState<SingleValue<Option>>(null);
  const [selectedMunicipio, setSelectedMunicipio] = useState<SingleValue<Option>>(null);

  useEffect(() => {
    // Obtener la lista de departamentos de Colombia
    fetch('https://api-colombia.com/api/v1/Department')
      .then(response => response.json())
      .then(data => {
        const departamentosOptions = data.map((departamento: any) => ({
          value: departamento.id,
          label: departamento.name,
        }));
        setDepartamentos(departamentosOptions);
      })
      .catch(error => {
        console.error("Error fetching departamentos:", error);
      });
  }, []);

  useEffect(() => {
    if (selectedDepartamento) {
      // Obtener los municipios del departamento seleccionado
      fetch(`https://api-colombia.com/api/v1/Department/${selectedDepartamento.value}/cities`)
        .then(response => response.json())
        .then(data => {
          const municipiosOptions = data.map((municipio: any) => ({
            value: municipio.id,
            label: municipio.name,
          }));
          setMunicipios(municipiosOptions);
        })
        .catch(error => {
          console.error("Error fetching municipios:", error);
        });
    }
  }, [selectedDepartamento]);

  const handleDepartamentoChange = (selectedOption: SingleValue<Option>) => {
    setSelectedDepartamento(selectedOption);
    setSelectedMunicipio(null); // Resetear municipio al cambiar departamento
  };

  const handleMunicipioChange = (selectedOption: SingleValue<Option>) => {
    setSelectedMunicipio(selectedOption);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="flex bg-white p-8 rounded-2xl shadow-lg w-3/4">
        <div className="flex flex-col items-start justify-center w-1/2 pr-8">
          <h2 className="text-3xl font-semibold mb-4">Bienvenido a Movix</h2>
          <p className="text-gray-500 text-lg mb-4">Regístrate para empezar a gestionar tus envíos y rastrear tus paquetes de manera sencilla y rápida.</p>
          <img src="register.jpg" alt="Registro" className="w-full h-auto" />
        </div>
        <div className="flex flex-col items-center justify-center w-1/2">
          <div className="flex flex-col items-center mb-6">
            <h2 className="text-2xl font-semibold">Registrarse</h2>
            <p className="text-gray-500 text-sm">Crea una cuenta para comenzar</p>
          </div>
          
          <form className="space-y-4 w-full">
            <div>
              <label className="text-sm text-gray-600">Nombre</label>
              <input type="text" className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="text-sm text-gray-600">Correo electrónico</label>
              <input type="email" className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="text-sm text-gray-600">Contraseña</label>
              <div className="relative">
                <input type="password" className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                <span className="absolute inset-y-0 right-3 flex items-center text-gray-400 cursor-pointer">👁️</span>
              </div>
            </div>
            <div>
              <label className="text-sm text-gray-600">Departamento</label>
              <Select 
                options={departamentos} 
                value={selectedDepartamento} 
                onChange={handleDepartamentoChange} 
                className="w-full"
              />
            </div>
            <div>
              <label className="text-sm text-gray-600">Municipio</label>
              <Select 
                options={municipios} 
                value={selectedMunicipio} 
                onChange={handleMunicipioChange} 
                className="w-full"
                isDisabled={!selectedDepartamento}
              />
            </div>
            <button className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600">Registrarse</button>
          </form>
        </div>
      </div>
    </div>
  );
}