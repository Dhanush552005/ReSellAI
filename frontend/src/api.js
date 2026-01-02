export async function predictResale(formData) {
  const response = await fetch("http://127.0.0.1:8000/predict", {
    method: "POST",
    body: formData,
  });

  return await response.json();
}
