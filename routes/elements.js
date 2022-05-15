const express = require('express');
const router = express.Router();
const dummyData = require('../db.json');
router.get('/', (req, res) => {
    res.json(dummyData);
});
router.get("/:element_id", (req, res) => {
    const element_id = req.params.element_id;
    if (dummyData.length <= element_id) return res.json({ message: "Element not found" });
    res.json(dummyData[element_id]);
});
router.post("/", (req, res) => {
    const element = req.body;
    dummyData.push(element);
    res.json(element);
});
router.put("/:element_id", (req, res) => {
    const element_id = req.params.element_id;
    const element = req.body;
    if (dummyData.length <= element_id) return res.json({ message: "element not found" });
    dummyData[element_id] = element;
    res.json(element);
});
router.delete("/:element_id", (req, res) => {
    const element_id = req.params.element_id;
    if (dummyData.length <= element_id) return res.json({ message: "Element not found" });
    dummyData.splice(element_id, 1);
    res.json({ message: "User deleted" });
});
module.exports = router;