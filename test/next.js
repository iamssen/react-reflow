const next = (delay = 1) => new Promise(resolve => setTimeout(resolve, delay));
export default next;