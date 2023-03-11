import { Button } from '@mui/material';
import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setPartialListingDetails } from '../../redux/reducers/listingsSlice';
import { ListingPreview as ListingPreviewType } from '../../types/listingPreview';
import useBreadcrumbHistory from '../common/useBreadcrumbHistory';
import './ListingPreview.scss';
import { ListingPreviewSkeleton } from './ListingPreviewSkeleton';

interface ListingPreviewProps {
  listing: ListingPreviewType;
  imageHeight?: string;
  imageWidth?: string;
  showRemoveListingButton?: boolean;
}

const ListingPreview: React.FC<ListingPreviewProps> = ({
  listing,
  imageHeight,
  imageWidth,
  showRemoveListingButton = false,
}) => {
  const navigate = useNavigate();
  const dispath = useDispatch();
  const height = '250px';
  const width = imageWidth ?? '220px';
  const history = useBreadcrumbHistory();
  if (!listing) {
    return <ListingPreviewSkeleton imageHeight={height} imageWidth={width} />;
  }
  const { imagePreview, listingName, cost, user, id } = listing;

  return (
    <div tabIndex={0} className="listing-preview">
      <img
        onClick={() => {
          dispath(setPartialListingDetails(listing));
          navigate(`/listing/${id}`, { state: { ...history } });
        }}
        className="listing-preview__image"
        src={`data:image/jpeg;base64,${imagePreview}`}
        height={imageHeight ?? height}
        width={width}
      />
      <span className="listing-preview__cost">${cost}</span>
      <div>{listingName}</div>
      {showRemoveListingButton ? (
        <Button
          color="secondary"
          variant="contained"
          className="listing-preview__remove-button"
          onClick={() => {
            alert('TODO');
          }}
        >
          Remove Listing
        </Button>
      ) : (
        <div>
          {user.FirstName}&nbsp;{user.LastName?.charAt(0)}.
        </div>
      )}
    </div>
  );
};

export default ListingPreview;
