import { motion } from "framer-motion"
import "../styles/Tile.css"
import tileImage from "../images/tile.png"

const TileTest = () => {

    return (
        <motion.div className="tile-test" whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.8 }}></motion.div>
      );
}

export default TileTest