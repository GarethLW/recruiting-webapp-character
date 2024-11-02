// src/components/Attributes.js

import React, { useState, useEffect } from 'react';
import Attribute from './Attribute';
import { ATTRIBUTE_LIST, CLASS_LIST, SKILL_LIST } from '../consts';
import '../App.css';

const apiUrl = "https://recruiting.verylongdomaintotestwith.ca/api/GarethLW/character";

const Attributes = () => {
  const initialAttributes = ATTRIBUTE_LIST.map(name => ({
    name,
    value: 10,
  }));
  
  const initialSkills = SKILL_LIST.map(skill => ({ ...skill, pointsSpent: 0 }));

  const [attributes, setAttributes] = useState(initialAttributes);
  const [skills, setSkills] = useState(initialSkills);

  useEffect(() => {
    fetchCharacter();
  }, []);

  const fetchCharacter = async () => {
    try {
      const response = await fetch(apiUrl);
      const data = await response.json();
      console.log("Fetched character data:", data); // Debug log
  
      // Access attributes and skills within `data.body`
      if (data.body && data.body.attributes && data.body.skills) {
        setAttributes(data.body.attributes);
        setSkills(data.body.skills);
      } else {
        console.log("No character data found or incorrect format.");
      }
    } catch (error) {
      console.error("Failed to fetch character data:", error);
    }
  };
  
  
  const saveCharacter = async () => {
    const characterData = { attributes, skills };
  
    try {
      console.log("Saving character data:", characterData); // Debug log
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(characterData),
      });
      
      if (!response.ok) {
        throw new Error(`Server error: ${response.statusText}`);
      }
      
      console.log("Character saved successfully:", await response.json());
      alert("Character saved successfully!");
    } catch (error) {
      console.error("Failed to save character data:", error);
    }
  };
  

  const getTotalPoints = () => attributes.reduce((sum, attr) => sum + attr.value, 0);

  const updateAttribute = (name, delta) => {
    const currentTotal = getTotalPoints();
    const attributeToUpdate = attributes.find(attr => attr.name === name);

    if (attributeToUpdate.value + delta >= 0 && (currentTotal + delta <= 70 || delta < 0)) {
      setAttributes(prevAttributes =>
        prevAttributes.map(attr =>
          attr.name === name
            ? { ...attr, value: attr.value + delta }
            : attr
        )
      );
    } else if (attributeToUpdate.value + delta < 0) {
      alert("Attributes cannot go below 0.");
    } else {
      alert("You can't exceed a total of 70 points for all attributes.");
    }
  };

  const getAttributeModifier = (attributeName) => {
    const attribute = attributes.find(attr => attr.name === attributeName);
    return Math.floor((attribute.value - 10) / 2);
  };

  const intelligenceModifier = getAttributeModifier("Intelligence");
  const totalSkillPoints = 10 + (4 * intelligenceModifier);

  const getSpentSkillPoints = () => skills.reduce((sum, skill) => sum + skill.pointsSpent, 0);

  const updateSkillPoints = (skillName, delta) => {
    const spentPoints = getSpentSkillPoints();

    if (spentPoints + delta <= totalSkillPoints && spentPoints + delta >= 0) {
      setSkills(prevSkills =>
        prevSkills.map(skill =>
          skill.name === skillName
            ? { ...skill, pointsSpent: Math.max(0, skill.pointsSpent + delta) }
            : skill
        )
      );
    } else {
      alert("Not enough skill points available.");
    }
  };

  const meetsRequirements = (classRequirements) => {
    return attributes.every(attr => attr.value >= classRequirements[attr.name]);
  };

  return (
    <div className="attributes-container">
      <h2>Character Attributes (Total Points: {getTotalPoints()}/70)</h2>
      {attributes.map(attr => (
        <Attribute
          key={attr.name}
          name={attr.name}
          value={attr.value}
          onIncrement={() => updateAttribute(attr.name, 1)}
          onDecrement={() => updateAttribute(attr.name, -1)}
        />
      ))}

      <h3>Class Requirements</h3>
      <div>
        {Object.entries(CLASS_LIST).map(([className, requirements]) => (
          <div
            key={className}
            className={`attribute-container ${
              meetsRequirements(requirements) ? 'attribute-met' : 'attribute-not-met'
            }`}
          >
            <h4>{className}</h4>
            <ul>
              {ATTRIBUTE_LIST.map(attrName => (
                <li key={attrName}>
                  {attrName}: {requirements[attrName]} (Current: {attributes.find(attr => attr.name === attrName).value})
                </li>
              ))}
            </ul>
            <p>{meetsRequirements(requirements) ? 'Requirements met!' : 'Requirements not met'}</p>
          </div>
        ))}
      </div>

      <h3>Skills (Available Points: {totalSkillPoints - getSpentSkillPoints()}/{totalSkillPoints})</h3>
      <div className="skills-container">
        {skills.map(skill => {
          const attributeModifier = getAttributeModifier(skill.attributeModifier);
          const totalSkillValue = skill.pointsSpent + attributeModifier;

          return (
            <div key={skill.name} className="skill-row">
              <h4>{skill.name}</h4>
              <p>Points: {skill.pointsSpent} </p>
              <button onClick={() => updateSkillPoints(skill.name, 1)}>+</button>
              <button onClick={() => updateSkillPoints(skill.name, -1)}>-</button>
              <p>Modifier ({skill.attributeModifier}): {attributeModifier}</p>
              <p>Total: {totalSkillValue}</p>
            </div>
          );
        })}
      </div>

      <button onClick={saveCharacter}>Save Character</button>
    </div>
  );
};

export default Attributes;
