
const brands = [
    "Ambassador", "Audi", "BMW", "Chevrolet", "Daewoo",
    "Datsun", "Fiat", "Force", "Ford", "Honda", "Hyundai",
    "Isuzu", "Jaguar", "Jeep", "Kia", "Land Rover",
    "MG", "Mahindra", "Maruti", "Mercedes-Benz",
    "Mitsubishi", "Nissan", "Renault", "Skoda",
    "Tata", "Toyota", "Volkswagen", "Volvo"
];

// Add car brands to dropdown
const brandSelect = document.getElementById("brand");

brands.forEach(brand => {
    const option = document.createElement("option");
    option.value = brand;
    option.textContent = brand;
    brandSelect.appendChild(option);
});
const nameSelect = document.getElementById("name");

brandSelect.addEventListener("change", async function () {
    const selectedBrand = brandSelect.value;

    nameSelect.innerHTML = '<option value="">Loading car models...</option>';
    nameSelect.disabled = true;

    if (!selectedBrand) {
        nameSelect.innerHTML = '<option value="">Select Car Model</option>';
        return;
    }

    try {
        const response = await fetch(
            `http://127.0.0.1:5000/car-names?brand=${encodeURIComponent(selectedBrand)}`
        );

        const names = await response.json();

        nameSelect.innerHTML = '<option value="">Select Car Model</option>';

        names.forEach(name => {
            const option = document.createElement("option");
            option.value = name;
            option.textContent = name;
            nameSelect.appendChild(option);
        });

        nameSelect.disabled = false;

    } catch (error) {
        nameSelect.innerHTML = '<option value="">Could not load models</option>';
        console.error(error);
    }
});

// Handle prediction form
document.getElementById("carForm").addEventListener("submit", async function(event) {

    event.preventDefault();

    const result = document.getElementById("result");
    result.style.color = "#2563eb";
    result.innerHTML = "Predicting car price...";

    const carData = {
    brand: document.getElementById("brand").value,
    name: document.getElementById("name").value,
    year: document.getElementById("year").value,
    km_driven: document.getElementById("km_driven").value,
    fuel: document.getElementById("fuel").value,
    seller_type: document.getElementById("seller_type").value,
    transmission: document.getElementById("transmission").value,
    owner: document.getElementById("owner").value
};

    try {
        const response = await fetch("http://127.0.0.1:5000/predict", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(carData)
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "Prediction failed");
        }

        result.style.color = "#15803d";
        result.innerHTML =
            "Estimated Car Price: ₹" +
            Number(data.predicted_price).toLocaleString("en-IN");

    } catch (error) {
        result.style.color = "#dc2626";
        result.innerHTML = "Error: " + error.message;
    }
});
