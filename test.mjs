const promises = [];

while (true) {
  await new Promise((resolve) => setTimeout(resolve), 100);
  const used = process.memoryUsage().heapUsed / 1024 / 1024;

  promises.push(new Promise((resolve) => {}));

  console.log(promises.length, 'Promises', used, 'Memory');
}
