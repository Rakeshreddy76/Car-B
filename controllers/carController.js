const Car = require('../models/Car');

exports.createCar = async (req, res) => {
    const { title, description, tags } = req.body;
    const images = req.files.map(file => file.path);

    if (images.length > 10) {
        return res.status(400).json({ message: 'Maximum 10 images allowed' });
    }

    try {
        const car = new Car({
            user: req.user.id,
            title,
            description,
            tags: JSON.parse(tags), 
            images,
        });
        const createdCar = await car.save();
        res.status(201).json(createdCar);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getCars = async (req, res) => {
    const { search } = req.query;
    let query = {};

    if (search) {
        query = {
            $or: [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { 'tags.car_type': { $regex: search, $options: 'i' } },
                { 'tags.company': { $regex: search, $options: 'i' } },
                { 'tags.dealer': { $regex: search, $options: 'i' } },
                // Add more fields as needed
            ],
        };
    }

    try {
        const cars = await Car.find(query).populate('user', 'username email');
        res.json(cars);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getCarById = async (req, res) => {
    try {
        const car = await Car.findById(req.params.id).populate('user', 'username email');
        if (car) {
            res.json(car);
        } else {
            res.status(404).json({ message: 'Car not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateCar = async (req, res) => {
    const { title, description, tags } = req.body;
    let images = [];
    if (req.files.length > 0) {
        images = req.files.map(file => file.path);
    }

    try {
        const car = await Car.findById(req.params.id);
        if (!car) {
            return res.status(404).json({ message: 'Car not found' });
        }

        if (car.user.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        car.title = title || car.title;
        car.description = description || car.description;
        car.tags = tags ? JSON.parse(tags) : car.tags;
        if (images.length > 0) {
            if (car.images.length + images.length > 10) {
                return res.status(400).json({ message: 'Maximum 10 images allowed' });
            }
            car.images = car.images.concat(images);
        }

        const updatedCar = await car.save();
        res.json(updatedCar);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteCar = async (req, res) => {
    try {
        const car = await Car.findById(req.params.id);
        if (!car) {
            return res.status(404).json({ message: 'Car not found' });
        }

        if (car.user.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        await car.remove();
        res.json({ message: 'Car removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
