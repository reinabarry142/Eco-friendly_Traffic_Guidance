// Fonctions utilitaires générales
export const formatNumber = (num) => {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
  };
  
  export const calculateCarbonSavings = (distance, transportType) => {
    const factors = {
      car: 0.192,
      bus: 0.089,
      bike: 0,
      walk: 0,
      electric: 0.05
    };
    
    return (distance * (factors.car - (factors[transportType] || 0)) / 1000);
  };