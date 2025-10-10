package com.shopeasy.service;

import com.shopeasy.DTOs.AddressRequestDTO;
import com.shopeasy.DTOs.AddressResponseDTO;
import com.shopeasy.exceptions.DataNotFoundException;
import com.shopeasy.models.Address;
import com.shopeasy.models.User;
import com.shopeasy.repositories.AddressRepository;
import com.shopeasy.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AddressService {
    
    private final AddressRepository addressRepository;
    private final UserRepository userRepository;
    private final ModelMapper modelMapper;
    
    public AddressResponseDTO createAddress(AddressRequestDTO dto, String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new DataNotFoundException("User not found."));
        
        Address address = modelMapper.map(dto, Address.class);
        address.setUser(user);
        
        address = addressRepository.save(address);
        return modelMapper.map(address, AddressResponseDTO.class);
    }
    
    public List<AddressResponseDTO> getAllAddresses(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new DataNotFoundException("User not found."));
        
        List<Address> addresses = addressRepository.findByUser(user);
        
        return addresses.stream()
                .map(a -> modelMapper.map(a, AddressResponseDTO.class))
                .collect(Collectors.toList());
    }
    
    public AddressResponseDTO getAddressById(String addressId, String userId) {
        Address address = addressRepository.findById(addressId)
                .orElseThrow(() -> new DataNotFoundException("Address not found."));
        
        if (!address.getUser().getUserId().equals(userId)) {
            throw new SecurityException("Unauthorized access to this address.");
        }
        
        return modelMapper.map(address, AddressResponseDTO.class);
    }
    
    public AddressResponseDTO updateAddress(String addressId, AddressRequestDTO dto) {
        Address address = addressRepository.findById(addressId)
                .orElseThrow(() -> new DataNotFoundException("Address not found."));
        
        address.setLine1(dto.getLine1());
        address.setLine2(dto.getLine2());
        address.setCity(dto.getCity());
        address.setState(dto.getState());
        address.setPostalCode(dto.getPostalCode());
        address.setCountry(dto.getCountry());
        
        Address updated = addressRepository.save(address);
        return modelMapper.map(updated, AddressResponseDTO.class);
    }
    
    public void deleteAddress(String userId, String addressId) {
        Address address = addressRepository.findById(addressId)
                .orElseThrow(() -> new DataNotFoundException("Address not found."));
        
        if (!address.getUser().getUserId().equals(userId)) {
            throw new SecurityException("Unauthorized access to delete this address.");
        }
        
        addressRepository.delete(address);
    }
}